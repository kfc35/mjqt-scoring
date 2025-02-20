import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SuitedTileValue, suitedTileValues } from "model/tile/tileValue";
import SuitedTile, { isSuitedTile } from "model/tile/group/suitedTile";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { partitionTilesByGroup } from "common/tileUtils";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { getOnlyTruthyElement } from "common/generic/setUtils";
import { getAllIndicesSet } from "common/meldUtils";
import { containsFourConcealedMeldsSubPredicate } from "service/point/predicate/impl/hand/concealedHandPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import PointPredicateSingleSuccessResult from "service/point/predicate/result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultMeldDetail from "service/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import PointPredicateSuccessResultTileDetail from "service/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResult from "service/point/predicate/result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "service/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "service/point/predicate/impl/util/pointPredicateUtil";
import { SUITED_TILES } from "common/deck";
import { meldToFlatTiles } from "common/meldUtils";
import { isHonorTile } from "model/tile/group/honorTile";

const sufficientTileQuantitiesNineGatesSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        /* check that it is all one suit */
        if (tileGroupValueMaps.getSuitedTileGroups().size > 1) {
            return new PointPredicateFailureResult.Builder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatFailPredicate(partitionTilesByGroup(meldToFlatTiles(standardWinningHand.melds).filter(tile => isSuitedTile(tile))))
                        .build()
                    ).build();
        }
        if (tileGroupValueMaps.getHonorTileGroups().size > 0) {
            return new PointPredicateFailureResult.Builder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatFailPredicate(partitionTilesByGroup(meldToFlatTiles(standardWinningHand.melds).filter(tile => isHonorTile(tile))))
                        .build()
                    ).build();
        }
        if (tileGroupValueMaps.getSuitedTileGroups().size < 1) {
            return new PointPredicateFailureResult.Builder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatFailPredicate(partitionTilesByGroup(meldToFlatTiles(standardWinningHand.melds).filter(tile => isSuitedTile(tile))))
                        .tilesThatAreMissingToSatisfyPredicate(partitionTilesByGroup(SUITED_TILES))
                        .build()
                    ).build();
        }

        /* start checking for quantities */
        const suitedTileGroup = getOnlyTruthyElement(tileGroupValueMaps.getSuitedTileGroups());
        const tilesOrderedBySTV: SuitedTile[][] = [];
        const failingTiles: SuitedTile[][] = [];
        const missingTiles: SuitedTile[][] = [];
        const extraTile: SuitedTile[] = [];
        for (const stv of suitedTileValues) {
            const suitedTiles : SuitedTile[] = tileGroupValueMaps.getTilesForSuitedTileValue(stv);
            if (!suitedTiles[0] || !suitedTiles.every(suitedTile => suitedTile)) {
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
                const suitedTile : SuitedTile = suitedTiles[0];
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
            // TODO should we distinguish between "any of" vs "missing THESE specific tiles" ? 
            const extraTileCandidates = (suitedTileValues.map(stv => constructSuitedTile(suitedTileGroup, stv)));
            missingTiles.push(extraTileCandidates);
        }

        if (!!failingTiles || !!missingTiles) {
            const failureBuilder = new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES);
            const tileDetail = new PointPredicateFailureResultTileDetail.Builder();
            if (!!failingTiles) {
                tileDetail.tilesThatFailPredicate(failingTiles);
            }
            if (!!missingTiles) {
                tileDetail.tilesThatAreMissingToSatisfyPredicate(missingTiles);
            }

            return failureBuilder.tileDetail(tileDetail.build()).build();
        }

        return new PointPredicateSingleSuccessResult.Builder()
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
        containsFourConcealedMeldsSubPredicate, // winning tile can be discard and finish any meld
        onePairSubPredicate);
export const NINE_GATES_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.NINE_GATES, nineGatesMeldBasedPredicate);