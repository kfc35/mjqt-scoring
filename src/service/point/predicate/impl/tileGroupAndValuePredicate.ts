import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { consolidateSets } from "common/generic/setUtils";
import { terminalSuitedTileValues, simpleSuitedTileValues, SuitedTileValue, DragonTileValue } from "model/tile/tileValue";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { type SuitedTileGroup } from "model/tile/group/suitedTile";
import { getOnlyTruthyElement } from "common/generic/setUtils";
import { getSuitedTilesForSuitedTileGroup, HONOR_TILES, SIMPLE_TILES, SUITED_TILES, TERMINAL_TILES } from "common/deck";
import PointPredicateFailureResult from "../result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "../result/tile/pointPredicateFailureResultTileDetail";
import PointPredicateSingleSuccessResult from "../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultTileDetail from "../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateSuccessResultMeldDetail from "../result/meldBased/pointPredicateSuccessResultMeldDetail";
import { getMeldsSubsetFromIndicesSet } from "common/meldUtils";
import { constructHonorTile } from "model/tile/group/honorTileConstructor";
import { TileGroup } from "model/tile/tileGroup";

// TODO break these up into sub predicates so that it may be easier to see where things failed?
export const ALL_ONE_SUIT_PREDICATE_STANDARD : PointPredicate<MeldBasedWinningHand> =
    (standardWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const suitedTileIndices: Set<number> = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        return allOneSuitPredicate(standardWinningHand, suitedTileIndices);
    };

export const ALL_ONE_SUIT_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> =
    (specialWinningHand : SpecialWinningHand) => {
        return allOneSuitPredicate(specialWinningHand);
    };

function handContainsOneSuitSubPredicate(winningHand: WinningHand, suitedTileIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    if (suitedTileGroups.size === 1) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldIndicesThatSatisfyPredicate(suitedTileIndicesSet)
                    .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate(tilesSepBySuit)
                    .build()
            )
            .build();
    } else if (suitedTileGroups.size > 1) {
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatFailPredicate(tilesSepBySuit)
                    .build()
            )
            .build();
    } else {
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatAreMissingToSatisfyPredicate([SUITED_TILES])
                    .build()
            )
            .build();
    }
}

function handContainsNoHonorsSubPredicate(winningHand: WinningHand) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    if (honorTileGroups.size === 0) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)
            .build();
    } else {
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatFailPredicate(honorTiles)
                    .build()
            )
            .build();
    }
}

function allOneSuitPredicate(winningHand: WinningHand, wrappedSuitedTileIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    return PointPredicateResult.and(PointPredicateID.ALL_ONE_SUIT, 
        handContainsOneSuitSubPredicate(winningHand, wrappedSuitedTileIndicesSet),
        handContainsNoHonorsSubPredicate(winningHand)
    );
}

export const ALL_ONE_SUIT_AND_HONORS_PREDICATE_STANDARD : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        return allOneSuitAndHonorsPredicate(standardWinningHand, suitedTileIndices, honorTileIndices);
    };

export const ALL_ONE_SUIT_AND_HONORS_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allOneSuitAndHonorsPredicate(specialWinningHand);
    };

function handContainsHonorsSubPredicate(winningHand: WinningHand, honorTileIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    if (honorTileGroups.size > 0) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldIndicesThatSatisfyPredicate(honorTileIndicesSet)
                    .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate(honorTiles)
                    .build()
            )
            .build();
    } else {
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatAreMissingToSatisfyPredicate([HONOR_TILES])
                    .build()
            )
            .build();
    }
}

function allOneSuitAndHonorsPredicate(winningHand: WinningHand, suitedTileIndicesSet: Set<number> = new Set(), honorTileIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    return PointPredicateResult.and(PointPredicateID.ALL_ONE_SUIT, 
        handContainsOneSuitSubPredicate(winningHand, suitedTileIndicesSet),
        handContainsHonorsSubPredicate(winningHand, honorTileIndicesSet)
    );
}

export const ALL_HONORS_PREDICATE_STANDARD : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        return allHonorsPredicate(standardWinningHand, honorTileIndices)
    };

export const ALL_HONORS_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allHonorsPredicate(specialWinningHand)
    };

function handContainsNoSuitsSubPredicate(winningHand: WinningHand) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    if (suitedTileGroups.size === 0) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)
            .build();
    } else {
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate(tilesSepBySuit)
                .build()
            )
            .build();
    }
}

function allHonorsPredicate(winningHand: WinningHand, honorTileIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    return PointPredicateResult.and(PointPredicateID.ALL_HONORS, 
        handContainsNoSuitsSubPredicate(winningHand),
        handContainsHonorsSubPredicate(winningHand, honorTileIndicesSet)
    ); // TODO matched indices?
}

export const VOIDED_SUIT_PREDICATE_STANDARD : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        
        return voidedSuitPredicate(standardWinningHand, suitedTileIndices);
    };

export const VOIDED_SUIT_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return voidedSuitPredicate(specialWinningHand);
    };

function voidedSuitPredicate(winningHand: WinningHand, suitedTileIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);

    if (suitedTileGroups.size == 2) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.VOIDED_SUIT)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                .meldIndicesThatSatisfyPredicate(suitedTileIndicesSet)
                .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                .tilesThatSatisfyPredicate(tilesSepBySuit)
                .build()
            )
            .build();
    }
    return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.VOIDED_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate(tilesSepBySuit)
                .build()
            )
            .build();
}

export const ALL_TERMINALS_PREDICATE_STANDARD : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        return allTerminalsPredicate(standardWinningHand, terminalIndices);
    };

export const ALL_TERMINALS_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allTerminalsPredicate(specialWinningHand);
    };

function allTerminalsPredicate(winningHand: WinningHand, terminalsIndicesSet: Set<number>= new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
    if (suitedTileValues.size <= terminalSuitedTileValues.size &&
        [...suitedTileValues.keys()].every(stv => terminalSuitedTileValues.has(stv)) && 
        tileGroupValueMaps.getHonorTileGroups().size === 0) {
        const terminalTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.ALL_TERMINALS)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                .meldIndicesThatSatisfyPredicate(terminalsIndicesSet)
                .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                .tilesThatSatisfyPredicate(terminalTiles)
                .build()
            )
            .build();
    }
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
    const nonTerminalTileValues : Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !terminalSuitedTileValues.has(stv)));
    const nonTerminalTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonTerminalTileValues).filter(tiles => tiles.length > 0);
    return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.ALL_TERMINALS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate([...honorTiles, ...nonTerminalTiles])
                .tilesThatAreMissingToSatisfyPredicate([TERMINAL_TILES])
                .build()
            )
            .build();
}

export const ALL_HONORS_AND_TERMINALS_PREDICATE_STANDARD : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        
        return allHonorsAndTerminalsPredicate(standardWinningHand, consolidateSets([terminalIndices, honorTileIndices]));
    };

export const ALL_HONORS_AND_TERMINALS_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allHonorsAndTerminalsPredicate(specialWinningHand);
    };

function allHonorsAndTerminalsPredicate(winningHand: WinningHand, honorsAndTerminalsIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    if (suitedTileValues.size === terminalSuitedTileValues.size &&
        [...terminalSuitedTileValues.keys()].every(terminal => suitedTileValues.has(terminal)) && 
        honorTileGroups.size !== 0) {
        const terminalTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.ALL_HONORS_AND_TERMINALS)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                .meldIndicesThatSatisfyPredicate(honorsAndTerminalsIndicesSet)
                .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                .tilesThatSatisfyPredicate([...terminalTiles, ...honorTiles])
                .build()
            )
            .build();
    }

    const nonTerminalTileValues : Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !terminalSuitedTileValues.has(stv)));
    const nonTerminalTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonTerminalTileValues).filter(tiles => tiles.length > 0);

    return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.ALL_HONORS_AND_TERMINALS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate(nonTerminalTiles)
                .tilesThatAreMissingToSatisfyPredicate([HONOR_TILES, TERMINAL_TILES])
                .build()
            )
            .build();
}

export const ALL_SIMPLES_PREDICATE_STANDARD : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
        const simplesIndices = consolidateSets([...simpleSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        return allSimplesPredicate(standardWinningHand, simplesIndices);
    };

export const ALL_SIMPLES_PREDICATE_SPECIAL : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allSimplesPredicate(specialWinningHand);
    };

function allSimplesPredicate(winningHand: WinningHand, simplesIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues: Set<SuitedTileValue> = tileGroupValueMaps.getSuitedTileValues();
    if (suitedTileValues.size <= simpleSuitedTileValues.size &&
        [...suitedTileValues.keys()].every(stv => simpleSuitedTileValues.has(stv)) && 
        tileGroupValueMaps.getHonorTileGroups().size === 0) {
        const simpleTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);

        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.ALL_SIMPLES)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                .meldIndicesThatSatisfyPredicate(simplesIndicesSet)
                .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                .tilesThatSatisfyPredicate(simpleTiles)
                .build()
            )
            .build();
    }

    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
    const nonSimpleTileValues : Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !simpleSuitedTileValues.has(stv)));
    const nonSimpleTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonSimpleTileValues).filter(tiles => tiles.length > 0);
    
    return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.ALL_SIMPLES)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate([...honorTiles, ...nonSimpleTiles])
                .tilesThatAreMissingToSatisfyPredicate([SIMPLE_TILES])
                .build()
            )
            .build();
}

export function allGivenSuitAndGivenDragonPredicate(pointPredicateId: string, standardWinningHand: MeldBasedWinningHand, 
    givenSuitedTileGroup: SuitedTileGroup, givenDragonTileValue: DragonTileValue) : PointPredicateResult {
    const tileGroupValueMaps = standardWinningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const honorTileValues = tileGroupValueMaps.getHonorTileValues();
    const suitedTilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    const honorTilesSepbyValue: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(honorTileValues);
        
    if (suitedTileGroups.size === 1 && givenSuitedTileGroup === getOnlyTruthyElement(suitedTileGroups) && 
        honorTileValues.size === 1 && givenDragonTileValue  === getOnlyTruthyElement(honorTileValues)) {
        const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        const honorTileIndices = consolidateSets([...honorTileValues.values()].map(tileValue => tileGroupValueMaps.getMeldIndicesForHonorTileValue(tileValue)));
        const indices = consolidateSets([suitedTileIndices, honorTileIndices]);
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(pointPredicateId)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldsThatSatisfyPredicate(getMeldsSubsetFromIndicesSet(standardWinningHand.melds, indices))
                    .meldIndicesThatSatisfyPredicate(indices)
                    .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([...suitedTilesSepBySuit, ...honorTilesSepbyValue])
                    .build()
            )
            .build()
    }

    // TODO chain these together so that all failures coalesce.
    if (suitedTileGroups.size > 0) {
        return new PointPredicateFailureResult.Builder()
        .pointPredicateId(pointPredicateId)
        .tileDetail(
            new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate(suitedTilesSepBySuit)
                .build()
        )
        .build();
    } else if (suitedTileGroups.size === 0) {
        return new PointPredicateFailureResult.Builder()
        .pointPredicateId(pointPredicateId)
        .tileDetail(
            new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatAreMissingToSatisfyPredicate([getSuitedTilesForSuitedTileGroup(givenSuitedTileGroup)])
                .build()
        )
        .build();
    } else if (honorTileValues.size > 0) { // what if honorTileValue.size is 0?
        return new PointPredicateFailureResult.Builder()
        .pointPredicateId(pointPredicateId)
        .tileDetail(
            new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate(honorTilesSepbyValue)
                .build()
        )
        .build();
    } else {
        return new PointPredicateFailureResult.Builder()
        .pointPredicateId(pointPredicateId)
        .tileDetail(
            new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatAreMissingToSatisfyPredicate([[constructHonorTile(TileGroup.DRAGON, givenDragonTileValue)]])
                .build()
        )
        .build();
    }
}