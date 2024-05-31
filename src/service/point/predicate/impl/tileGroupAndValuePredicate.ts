import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { consolidateSets, wrapSet } from "common/generic/setUtils";

export const ALL_ONE_SUIT_PREDICATE : PointPredicate<StandardWinningHand> =
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
        const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
        
        if (suitedTileGroups.size === 1 && honorTileGroups.size === 0) {
            const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
            return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT, true, [tilesSepBySuit], [], wrapSet(suitedTileIndices), []);
        }

        if (suitedTileGroups.size !== 1) {
            return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT, false, [], tilesSepBySuit, new Set(), []);
        } else { // has honors
            return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT, false, [], honorTiles, new Set(), []);
        }
    };

export const ALL_ONE_SUIT_AND_HONORS_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
        
        if (suitedTileGroups.size === 1 && honorTileGroups.size > 0) {
            const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
            const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
            
            return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT_AND_HONORS, true, [tilesSepBySuit], [], wrapSet(consolidateSets([suitedTileIndices, honorTileIndices])), []);
        }

        if (suitedTileGroups.size !== 1) {
            return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT_AND_HONORS, false, [], tilesSepBySuit, new Set(), []);
        } else { // does not have honors
            return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT_AND_HONORS, false, [], [], new Set(), []);
        }
    };

export const ALL_HONORS_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);

        if (suitedTileGroups.size === 0 && honorTileGroups.size > 0) {
            const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
            return new PointPredicateResult(PointPredicateID.ALL_HONORS, true, [honorTiles], [], wrapSet(honorTileIndices), []);
        }

        if (suitedTileGroups.size > 0) {
            const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
            return new PointPredicateResult(PointPredicateID.ALL_HONORS, false, [], tilesSepBySuit, new Set(), []);
        } // does not have honors too.
        return new PointPredicateResult(PointPredicateID.ALL_HONORS, false, [], [], new Set(), []);
    };
/*

function createVoidedSuitPredicate(standardWinningHand: StandardWinningHand, tileMaps: StandardWinningHandTileMaps) : PointPredicate<StandardWinningHand> {
    return () => {
        if (tileMaps.getSuitedTileGroups().size == 2) {
            return new PointPredicateResult(PointPredicateID.VOIDED_SUIT, true, [], [], new Set(), []);
        }
        return new PointPredicateResult(PointPredicateID.VOIDED_SUIT, false, [], [], new Set(), []);
    }
}

function createAllTerminalsPredicate(standardWinningHand: StandardWinningHand, tileMaps: StandardWinningHandTileMaps) : PointPredicate<StandardWinningHand> {
    return () => {
        const suitedTileValues: Set<SuitedTileValue> = tileMaps.getSuitedTileValues();
        if (tileMaps.getSuitedTileValues().size === terminalSuitedTileValues.size &&
            [...terminalSuitedTileValues.keys()].every(terminal => suitedTileValues.has(terminal)) && 
            tileMaps.getHonorTileGroups().size === 0) {
            return new PointPredicateResult(PointPredicateID.ALL_TERMINALS, true, [], [], new Set(), []);
        }
        return new PointPredicateResult(PointPredicateID.ALL_TERMINALS, false, [], [], new Set(), []);
    }
}

function createAllHonorsAndTerminalsPredicate(standardWinningHand: StandardWinningHand, tileMaps: StandardWinningHandTileMaps) : PointPredicate<StandardWinningHand> {
    return () => {
        const suitedTileValues: Set<SuitedTileValue> = tileMaps.getSuitedTileValues();
        if (tileMaps.getSuitedTileValues().size === terminalSuitedTileValues.size &&
            [...terminalSuitedTileValues.keys()].every(terminal => suitedTileValues.has(terminal)) && 
            tileMaps.getHonorTileGroups().size > 0) {
            return new PointPredicateResult(PointPredicateID.ALL_HONORS_AND_TERMINALS, true, [], [], new Set(), []);
        }
        return new PointPredicateResult(PointPredicateID.ALL_HONORS_AND_TERMINALS, false, [], [], new Set(), []);
    }
}

function createAllSimplesPredicate(standardWinningHand: StandardWinningHand, tileMaps: StandardWinningHandTileMaps) : PointPredicate<StandardWinningHand> {
    return () => {
        const suitedTileValues: Set<SuitedTileValue> = tileMaps.getSuitedTileValues();
        if (tileMaps.getSuitedTileValues().size === simpleSuitedTileValues.size &&
            [...simpleSuitedTileValues.keys()].every(simple => suitedTileValues.has(simple)) && 
            tileMaps.getHonorTileGroups().size === 0) {
            return new PointPredicateResult(PointPredicateID.ALL_SIMPLES, true, [], [], new Set(), []);
        }
        return new PointPredicateResult(PointPredicateID.ALL_SIMPLES, false, [], [], new Set(), []);
    }
}*/