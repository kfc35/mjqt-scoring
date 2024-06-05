import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { consolidateSets, wrapSet } from "common/generic/setUtils";
import { terminalSuitedTileValues, simpleSuitedTileValues, SuitedTileValue } from "model/tile/tileValue";

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

        return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT, false, [], [...tilesSepBySuit, ...honorTiles], new Set(), []);
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

export const VOIDED_SUIT_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);

        if (suitedTileGroups.size == 2) {
            const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
            return new PointPredicateResult(PointPredicateID.VOIDED_SUIT, true, [tilesSepBySuit], [], wrapSet(suitedTileIndices), []);
        }
        return new PointPredicateResult(PointPredicateID.VOIDED_SUIT, false, [], tilesSepBySuit, new Set(), []);
    };

export const ALL_TERMINALS_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
        if (suitedTileValues.size === terminalSuitedTileValues.size &&
            [...terminalSuitedTileValues.keys()].every(terminal => suitedTileValues.has(terminal)) && 
            tileGroupValueMaps.getHonorTileGroups().size === 0) {
            const terminalTiles : SuitedOrHonorTile[][] = [...terminalSuitedTileValues].map(stv => tileGroupValueMaps.getTilesForSuitedTileValue(stv));
            return new PointPredicateResult(PointPredicateID.ALL_TERMINALS, true, [terminalTiles], [], new Set(), []);
        }
        const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
        const nonTerminalTiles : SuitedOrHonorTile[][] = [...suitedTileValues].filter(stv => !terminalSuitedTileValues.has(stv))
            .map(stv => tileGroupValueMaps.getTilesForSuitedTileValue(stv))
            .filter(tiles => tiles.length !== 0);
        return new PointPredicateResult(PointPredicateID.ALL_TERMINALS, false, [], [...honorTiles, ...nonTerminalTiles], new Set(), []);
    };

export const ALL_HONORS_AND_TERMINALS_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
        if (suitedTileValues.size === terminalSuitedTileValues.size &&
            [...terminalSuitedTileValues.keys()].every(terminal => suitedTileValues.has(terminal)) && 
            honorTileGroups.size !== 0) {
            const terminalTiles : SuitedOrHonorTile[][] = [...terminalSuitedTileValues].map(stv => tileGroupValueMaps.getTilesForSuitedTileValue(stv));
            return new PointPredicateResult(PointPredicateID.ALL_HONORS_AND_TERMINALS, true, [terminalTiles, honorTiles], [], new Set(), []);
        }

        const nonTerminalTiles : SuitedOrHonorTile[][] = [...suitedTileValues].filter(stv => !terminalSuitedTileValues.has(stv))
            .map(stv => tileGroupValueMaps.getTilesForSuitedTileValue(stv))
            .filter(tiles => tiles.length !== 0);
        // if it's only terminals and no honors, the failureTiles will be empty.
        return new PointPredicateResult(PointPredicateID.ALL_HONORS_AND_TERMINALS, false, [], [...nonTerminalTiles], new Set(), []);
    };

export const ALL_SIMPLES_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileValues: Set<SuitedTileValue> = tileGroupValueMaps.getSuitedTileValues();
        if (suitedTileValues.size === simpleSuitedTileValues.size &&
            [...simpleSuitedTileValues.keys()].every(simple => suitedTileValues.has(simple)) && 
            tileGroupValueMaps.getHonorTileGroups().size === 0) {
            const simpleTiles : SuitedOrHonorTile[][] = [...simpleSuitedTileValues].map(stv => tileGroupValueMaps.getTilesForSuitedTileValue(stv));
            return new PointPredicateResult(PointPredicateID.ALL_SIMPLES, true, [simpleTiles], [], new Set(), []);
        }

        const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
        const nonSimpleTiles : SuitedOrHonorTile[][] = [...suitedTileValues].filter(stv => !simpleSuitedTileValues.has(stv))
            .map(stv => tileGroupValueMaps.getTilesForSuitedTileValue(stv))
            .filter(tiles => tiles.length !== 0);
        return new PointPredicateResult(PointPredicateID.ALL_SIMPLES, false, [], [...honorTiles, ...nonSimpleTiles], new Set(), []);
    };