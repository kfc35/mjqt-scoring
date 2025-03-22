import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SuitedTileValue, suitedTileValues } from "model/tile/tileValue";
import { SuitedTile } from "model/tile/group/suitedTile";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { partitionTilesByGroup } from "common/tileUtils";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { getOnlyTruthyElement } from "common/generic/setUtils";
import { getAllIndicesSet } from "common/meldUtils";
import { atLeastNumMeldsMinusOneAreConcealedSubPredicate } from "service/point/predicate/impl/hand/concealedHandPredicate";
import { PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateSuccessResultTileDetail } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultTileDetail } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "service/point/predicate/impl/util/pointPredicateUtil";
import { meldToFlatTiles } from "common/meldUtils";
import { isHonorTile } from "model/tile/group/honorTile";
import { ifThereIsOnlyOneExposedMeldThenItIsMeldWithLastTileSubPredicate } from "./lastTileSubPredicate";

const sufficientTileQuantitiesNineGatesSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        /* check that it is all one suit no honors */
        if (tileGroupValueMaps.getHonorTileGroups().size > 0) {
            return new PointPredicateFailureResultBuilder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatFailPredicate(partitionTilesByGroup(meldToFlatTiles(standardWinningHand.melds).filter(tile => isHonorTile(tile))))
                        .build()
                    ).build();
        }
        if (tileGroupValueMaps.getSuitedTileGroups().size > 1) {
            return new PointPredicateFailureResultBuilder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatFailPredicate(partitionTilesByGroup(meldToFlatTiles(standardWinningHand.melds)))
                        .build()
                    ).build();
        }
        // There are no honorTileGroups, so there should be no need to check for suitedTileGroups().size === 0 
        if (tileGroupValueMaps.getSuitedTileGroups().size === 0) {
            throw new Error('tileGroupValueMaps.getSuitedTileGroups().size === 0, which should not happen.');
        }

        /* start checking for quantities */
        const suitedTileGroup = getOnlyTruthyElement(tileGroupValueMaps.getSuitedTileGroups());
        const tilesOrderedBySTV: SuitedTile[][] = [];
        const failingTiles: SuitedTile[][] = [];
        const missingTiles: SuitedTile[][] = [];
        const missingTilesAnyOf: SuitedTile[][] = [];
        const extraTile: SuitedTile[] = [];
        for (const stv of suitedTileValues) {
            const suitedTiles : SuitedTile[] = tileGroupValueMaps.getTilesForSuitedTileValue(stv);
            if (suitedTiles.length > 0 && !suitedTiles[0] || !suitedTiles.every(suitedTile => suitedTile)) {
                throw new Error(`suitedTiles has an undefined element, which should not happen.`);
            }

            let minimumRequiredSuitedTileLength = 1;
            if (stv === SuitedTileValue.ONE || stv === SuitedTileValue.NINE) {
                minimumRequiredSuitedTileLength = 3
            }

            if (suitedTiles.length < minimumRequiredSuitedTileLength) {
                const missing: SuitedTile[] = [];
                for (let i = 0; i < minimumRequiredSuitedTileLength - suitedTiles.length; i++) {
                    missing.push(constructSuitedTile(suitedTileGroup, stv));
                }
                missingTiles.push(missing);
            } else if (suitedTiles.length === minimumRequiredSuitedTileLength) {
                tilesOrderedBySTV.push(suitedTiles);
            } else if (suitedTiles.length === (minimumRequiredSuitedTileLength + 1)) {
                const suitedTile : SuitedTile | undefined = suitedTiles[0];
                if (!suitedTile) {
                    throw new Error(`suitedTiles has an undefined element, which should not happen.`);
                }
                extraTile.push(suitedTile);
                tilesOrderedBySTV.push(suitedTiles);
            } else { //  minimumRequiredSuitedTileLength + 1 < suitedTiles.length, too many extra tiles
                const failing: SuitedTile[] = [];
                for (let i = minimumRequiredSuitedTileLength + 1; i < suitedTiles.length; i++) {
                    failing.push(constructSuitedTile(suitedTileGroup, stv));
                }
                failingTiles.push(failing);
            }
        }

        if (extraTile.length > 1) {
            failingTiles.push(extraTile);
        }
        if (extraTile.length < 1) { // this should not happen because of the logic... but in case it does...
            // any tile will do as an extra tile.
            const extraTileCandidates = (suitedTileValues.map(stv => constructSuitedTile(suitedTileGroup, stv)));
            missingTilesAnyOf.push(extraTileCandidates);
        }

        if ((!!failingTiles && failingTiles.length > 0) || 
            (!!missingTiles && missingTiles.length > 0) || 
            (!!missingTilesAnyOf && missingTilesAnyOf.length > 0)) {
            const failureBuilder = new PointPredicateFailureResultBuilder().pointPredicateId(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES);
            const tileDetail = new PointPredicateFailureResultTileDetail.Builder();
            if (!!failingTiles && failingTiles.length > 0) {
                tileDetail.tilesThatFailPredicate(failingTiles);
            }
            if (!!missingTiles && missingTiles.length > 0) {
                tileDetail.tilesThatAreMissingToSatisfyPredicate(missingTiles);
            }
            if (!!missingTilesAnyOf&& missingTilesAnyOf.length > 0) {
                tileDetail.tilesThatAreMissingAnyOfToSatisfyPredicate(missingTilesAnyOf);
            }

            return failureBuilder.tileDetail(tileDetail.build()).build();
        }

        return new PointPredicateSingleSuccessResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
            .meldDetail(new PointPredicateSuccessResultMeldDetail.Builder()
                .meldsThatSatisfyPredicate([...standardWinningHand.melds])
                .meldIndicesThatSatisfyPredicate(getAllIndicesSet(standardWinningHand.melds))
                .build()
            )
            .tileDetail(new PointPredicateSuccessResultTileDetail.Builder()
                .tilesThatSatisfyPredicate([...tilesOrderedBySTV, extraTile])
                .build()
            )
            .build();
    }

const nineGatesMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.NINE_GATES,
        sufficientTileQuantitiesNineGatesSubPredicate,
        // concealed hand, but last tile can always finish any meld (even if it conflicts with concealed hand logic option)
        atLeastNumMeldsMinusOneAreConcealedSubPredicate,
        ifThereIsOnlyOneExposedMeldThenItIsMeldWithLastTileSubPredicate);
export const NINE_GATES_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.NINE_GATES, nineGatesMeldBasedPredicate);