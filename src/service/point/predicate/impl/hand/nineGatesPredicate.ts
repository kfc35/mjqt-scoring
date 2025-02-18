import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SuitedTileValue, suitedTileValues } from "model/tile/tileValue";
import SuitedTile from "model/tile/group/suitedTile";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { suitedTilesAreAllSameSuit, partitionTilesByGroup } from "common/tileUtils";
import { allOneSuitMeldBasedPredicate } from "service/point/predicate/impl/tileGroupAndValuePredicate";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { getOnlyTruthyElement } from "common/generic/setUtils";
import { getAllIndicesSet } from "common/meldUtils";
import { atLeastFourConcealedMeldsSubPredicate } from "service/point/predicate/impl/hand/concealedHandPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultMeldDetail from "../../result/meldBased/pointPredicateSuccessResultMeldDetail";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "../util/pointPredicateUtil";

const sufficientTileQuantitiesNineGatesSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const extraTile: SuitedTile[] = [];
        const tilesOrderedBySTV: SuitedTile[][] = [];
        for (const stv of suitedTileValues) {
            const suitedTiles : SuitedTile[] = tileGroupValueMaps.getTilesForSuitedTileValue(stv);
            let minimumRequiredSuitedTileLength = 1;

            if (!suitedTiles[0] || !suitedTiles.every(suitedTile => suitedTile)) {
                throw new Error(`suitedTiles has an undefined element, which should not happen.`);
            }
            if (!suitedTilesAreAllSameSuit(suitedTiles)) {
                return new PointPredicateFailureResult.Builder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatFailPredicate(partitionTilesByGroup(suitedTiles))
                        .build()
                    ).build();
            }

            if (stv === SuitedTileValue.ONE || stv === SuitedTileValue.NINE) {
                minimumRequiredSuitedTileLength = 3
            }
            if (suitedTiles.length < minimumRequiredSuitedTileLength) {
                const suitedTileGroup = getOnlyTruthyElement(tileGroupValueMaps.getSuitedTileGroups());
                const missingTiles: SuitedTile[] = [];
                for (let i = 0; i < minimumRequiredSuitedTileLength - suitedTiles.length; i++) {
                    missingTiles.push(constructSuitedTile(suitedTileGroup, stv));
                }
                return new PointPredicateFailureResult.Builder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatAreMissingToSatisfyPredicate([missingTiles])
                        .build()
                    ).build();
            } else if (suitedTiles.length === minimumRequiredSuitedTileLength) {
                tilesOrderedBySTV.push(suitedTiles);
            } else if (suitedTiles.length === (minimumRequiredSuitedTileLength + 1)) {
                const suitedTile : SuitedTile = suitedTiles[0];
                extraTile.push(suitedTile);
                tilesOrderedBySTV.push(suitedTiles);
            } else {
                return new PointPredicateFailureResult.Builder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatFailPredicate([suitedTiles])
                        .build()
                    ).build();
            }
        }

        if (extraTile.length > 1) {
            return new PointPredicateFailureResult.Builder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatFailPredicate([extraTile])
                        .build()
                    ).build();
        }
        if (extraTile.length < 1) {
            const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
            const missingTiles: SuitedTile[][] = [...suitedTileGroups].map(stg => (suitedTileValues.map(stv => constructSuitedTile(stg, stv))));
            return new PointPredicateFailureResult.Builder()
                    .pointPredicateId(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
                    .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                        .tilesThatAreMissingToSatisfyPredicate(missingTiles)
                        .build()
                    ).build();
        }

        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)
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
    predicateAnd(PointPredicateID.NINE_GATES, allOneSuitMeldBasedPredicate, 
        sufficientTileQuantitiesNineGatesSubPredicate,
        atLeastFourConcealedMeldsSubPredicate, // winning tile can be discard and finish any meld
        onePairSubPredicate);
export const NINE_GATES_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.NINE_GATES, nineGatesMeldBasedPredicate);