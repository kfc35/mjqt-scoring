import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { SuitedTileValue, suitedTileValues } from "model/tile/tileValue";
import SuitedTile from "model/tile/group/suitedTile";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { suitedTilesAreAllSameSuit, separateTilesByGroup } from "common/tileUtils";
import { ALL_ONE_SUIT_PREDICATE_STANDARD } from "service/point/predicate/impl/tileGroupAndValuePredicate";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { wrapSet } from "common/generic/setUtils";
import { getAllIndicesSet } from "common/meldUtils";
import { atLeastFourConcealedMeldsSubPredicate } from "service/point/predicate/impl/hand/concealedHandPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/hand/handSubPredicate";

const sufficientTileQuantitiesNineGatesSubPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
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
                return new PointPredicateResult(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES, 
                    false, [], separateTilesByGroup(suitedTiles), new Set(), []);
            }

            if (stv === SuitedTileValue.ONE || stv === SuitedTileValue.NINE) {
                minimumRequiredSuitedTileLength = 3
            }
            if (suitedTiles.length <= 0) {
                const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
                const missingTiles: SuitedTile[] = [...suitedTileGroups].map(stg => constructSuitedTile(stg, stv));
                return new PointPredicateResult(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES, 
                    false, [], [missingTiles], new Set(), []);
            }
            if (suitedTiles.length < minimumRequiredSuitedTileLength) {
                return new PointPredicateResult(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES, 
                    false, [], [suitedTiles], new Set(), []);
            } else if (suitedTiles.length === minimumRequiredSuitedTileLength) {
                tilesOrderedBySTV.push(suitedTiles);
            } else if (suitedTiles.length === (minimumRequiredSuitedTileLength + 1)) {
                const suitedTile : SuitedTile = suitedTiles[0];
                extraTile.push(suitedTile);
                tilesOrderedBySTV.push(suitedTiles);
            } else {
                return new PointPredicateResult(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES, 
                    false, [], [suitedTiles], new Set(), []);
            }
        }

        if (extraTile.length > 1) {
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES, 
                false, [], [extraTile], new Set(), []);
        }
        if (extraTile.length < 1) {
            const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
            const missingTiles: SuitedTile[][] = [...suitedTileGroups].map(stg => (suitedTileValues.map(stv => constructSuitedTile(stg, stv))));
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES, 
                false, [], missingTiles, new Set(), []);
        }

        return new PointPredicateResult(PointPredicateID.SUBPREDICATE_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES, 
            true, [[...tilesOrderedBySTV, extraTile]], [], wrapSet(getAllIndicesSet(standardWinningHand.getMelds())), []);
    }

export const NINE_GATES_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.NINE_GATES, ALL_ONE_SUIT_PREDICATE_STANDARD, 
        sufficientTileQuantitiesNineGatesSubPredicate,
        atLeastFourConcealedMeldsSubPredicate, // winning tile can be discard.
        onePairSubPredicate);
