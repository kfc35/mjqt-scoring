import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { consolidateSets, wrapSet } from "common/generic/setUtils";
import { terminalSuitedTileValues, simpleSuitedTileValues, SuitedTileValue } from "model/tile/tileValue";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";

// TODO break these up into sub predicates so that it may be easier to see where things failed?

export const ALL_ONE_SUIT_PREDICATE_STANDARD : PointPredicate<StandardWinningHand> =
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const suitedTileIndices: Set<number> = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        return allOneSuitPredicate(standardWinningHand, wrapSet(suitedTileIndices));
    };

export const ALL_ONE_SUIT_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> =
    (specialWinningHand : SpecialWinningHand) => {
        return allOneSuitPredicate(specialWinningHand);
    };

function allOneSuitPredicate(winningHand: WinningHand, wrappedSuitedTileIndicesSet: Set<Set<number>> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    
    if (suitedTileGroups.size === 1 && honorTileGroups.size === 0) {
        return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT, true, [tilesSepBySuit], [], wrappedSuitedTileIndicesSet, []);
    }

    // TODO what if SuitedTileGroups = 0? desired?
    return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT, false, [], [...tilesSepBySuit, ...honorTiles], new Set(), []);
}

export const ALL_ONE_SUIT_AND_HONORS_PREDICATE_STANDARD : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        return allOneSuitAndHonorsPredicate(standardWinningHand, wrapSet(consolidateSets([suitedTileIndices, honorTileIndices])));
    };

export const ALL_ONE_SUIT_AND_HONORS_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allOneSuitAndHonorsPredicate(specialWinningHand);
    };

function allOneSuitAndHonorsPredicate(winningHand: WinningHand, wrappedSuitedAndHonorTileIndicesSet: Set<Set<number>> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
        
    if (suitedTileGroups.size === 1 && honorTileGroups.size > 0) {
        return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT_AND_HONORS, true, [tilesSepBySuit], [], wrappedSuitedAndHonorTileIndicesSet, []);
    }

    if (suitedTileGroups.size !== 1) {
        // TODO if suitedTileGroups is 0, failedTiles is empty. desired?
        return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT_AND_HONORS, false, [], tilesSepBySuit, new Set(), []);
    } else { // does not have honors
        return new PointPredicateResult(PointPredicateID.ALL_ONE_SUIT_AND_HONORS, false, [], [], new Set(), []);
    }
}

export const ALL_HONORS_PREDICATE_STANDARD : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        return allHonorsPredicate(standardWinningHand, wrapSet(honorTileIndices))
    };

export const ALL_HONORS_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allHonorsPredicate(specialWinningHand)
    };

function allHonorsPredicate(winningHand: WinningHand, wrappedHonorTileIndicesSet: Set<Set<number>> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);

    if (suitedTileGroups.size === 0 && honorTileGroups.size > 0) {
        return new PointPredicateResult(PointPredicateID.ALL_HONORS, true, [honorTiles], [], wrappedHonorTileIndicesSet, []);
    }

    if (suitedTileGroups.size > 0) {
        const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
        return new PointPredicateResult(PointPredicateID.ALL_HONORS, false, [], tilesSepBySuit, new Set(), []);
    } // does not have honors too.
    return new PointPredicateResult(PointPredicateID.ALL_HONORS, false, [], [], new Set(), []);
}

export const VOIDED_SUIT_PREDICATE_STANDARD : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        
        return voidedSuitPredicate(standardWinningHand, wrapSet(suitedTileIndices));
    };

export const VOIDED_SUIT_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return voidedSuitPredicate(specialWinningHand);
    };

function voidedSuitPredicate(winningHand: WinningHand, wrappedSuitedTileIndicesSet: Set<Set<number>> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);

    if (suitedTileGroups.size == 2) {
        return new PointPredicateResult(PointPredicateID.VOIDED_SUIT, true, [tilesSepBySuit], [], wrappedSuitedTileIndicesSet, []);
    }
    return new PointPredicateResult(PointPredicateID.VOIDED_SUIT, false, [], tilesSepBySuit, new Set(), []);
}

export const ALL_TERMINALS_PREDICATE_STANDARD : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        return allTerminalsPredicate(standardWinningHand, wrapSet(terminalIndices));
    };

export const ALL_TERMINALS_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allTerminalsPredicate(specialWinningHand);
    };

function allTerminalsPredicate(winningHand: WinningHand, wrappedTerminalsIndicesSet: Set<Set<number> >= new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
    if (suitedTileValues.size <= terminalSuitedTileValues.size &&
        [...suitedTileValues.keys()].every(stv => terminalSuitedTileValues.has(stv)) && 
        tileGroupValueMaps.getHonorTileGroups().size === 0) {
        const terminalTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);
        return new PointPredicateResult(PointPredicateID.ALL_TERMINALS, true, [terminalTiles], [], wrappedTerminalsIndicesSet, []);
    }
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
    const nonTerminalTileValues : Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !terminalSuitedTileValues.has(stv)));
    const nonTerminalTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonTerminalTileValues).filter(tiles => tiles.length > 0);
    return new PointPredicateResult(PointPredicateID.ALL_TERMINALS, false, [], [...honorTiles, ...nonTerminalTiles], new Set(), []);
}

export const ALL_HONORS_AND_TERMINALS_PREDICATE_STANDARD : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        
        return allHonorsAndTerminalsPredicate(standardWinningHand, wrapSet(consolidateSets([terminalIndices, honorTileIndices])));
    };

export const ALL_HONORS_AND_TERMINALS_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allHonorsAndTerminalsPredicate(specialWinningHand);
    };

function allHonorsAndTerminalsPredicate(winningHand: WinningHand, wrappedHonorsAndTerminalsIndicesSet: Set<Set<number>> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    if (suitedTileValues.size === terminalSuitedTileValues.size &&
        [...terminalSuitedTileValues.keys()].every(terminal => suitedTileValues.has(terminal)) && 
        honorTileGroups.size !== 0) {
        const terminalTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);
        return new PointPredicateResult(PointPredicateID.ALL_HONORS_AND_TERMINALS, true, [terminalTiles, honorTiles], [], wrappedHonorsAndTerminalsIndicesSet, []);
    }

    const nonTerminalTileValues : Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !terminalSuitedTileValues.has(stv)));
    const nonTerminalTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonTerminalTileValues).filter(tiles => tiles.length > 0);
    // if it's only terminals and no honors, the failureTiles will be empty. TODO do we want to add the honor tiles to the failure tiles as "missing tiles"?
    return new PointPredicateResult(PointPredicateID.ALL_HONORS_AND_TERMINALS, false, [], [...nonTerminalTiles], new Set(), []);
}

export const ALL_SIMPLES_PREDICATE_STANDARD : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const simplesIndices = consolidateSets([...simpleSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        return allSimplesPredicate(standardWinningHand, wrapSet(simplesIndices));
    };

export const ALL_SIMPLES_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allSimplesPredicate(specialWinningHand);
    };

function allSimplesPredicate(winningHand: WinningHand, wrappedSimplesIndicesSet: Set<Set<number>> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues: Set<SuitedTileValue> = tileGroupValueMaps.getSuitedTileValues();
    if (suitedTileValues.size <= simpleSuitedTileValues.size &&
        [...suitedTileValues.keys()].every(stv => simpleSuitedTileValues.has(stv)) && 
        tileGroupValueMaps.getHonorTileGroups().size === 0) {
        const simpleTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);
        return new PointPredicateResult(PointPredicateID.ALL_SIMPLES, true, [simpleTiles], [], wrappedSimplesIndicesSet, []);
    }

    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
    const nonSimpleTileValues : Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !simpleSuitedTileValues.has(stv)));
    const nonSimpleTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonSimpleTileValues).filter(tiles => tiles.length > 0);
    return new PointPredicateResult(PointPredicateID.ALL_SIMPLES, false, [], [...honorTiles, ...nonSimpleTiles], new Set(), []);
}