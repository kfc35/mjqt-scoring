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
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateSuccessResultMeldDetail from "../../result/meldBased/pointPredicateSuccessResultMeldDetail";
import { getMeldsSubsetFromIndicesSet } from "common/meldUtils";
import { constructHonorTile } from "model/tile/group/honorTileConstructor";
import { TileGroup } from "model/tile/tileGroup";
import { createGenericPointPredicateRouter as createPointPredicateRouter } from "../util/pointPredicateUtil";

// TODO break this file up, it is too long.

export const allOneSuitMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> =
    (meldBasedWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const suitedTileIndices: Set<number> = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        return allOneSuitPredicate(meldBasedWinningHand, suitedTileIndices);
    };

const allOneSuitSpecialPredicate : PointPredicate<SpecialWinningHand> =
    (specialWinningHand : SpecialWinningHand) => {
        return allOneSuitPredicate(specialWinningHand);
    };

export const ALL_ONE_SUIT_PREDICATE : PointPredicate<WinningHand> = 
    createPointPredicateRouter(allOneSuitMeldBasedPredicate, allOneSuitSpecialPredicate);

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

const allOneSuitAndHonorsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        return allOneSuitAndHonorsPredicate(meldBasedWinningHand, suitedTileIndices, honorTileIndices);
    };

const allOneSuitAndHonorsSpecialPredicate : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allOneSuitAndHonorsPredicate(specialWinningHand);
    };

export const ALL_ONE_SUIT_AND_HONORS_PREDICATE : PointPredicate<WinningHand> =
    createPointPredicateRouter(allOneSuitAndHonorsMeldBasedPredicate, allOneSuitAndHonorsSpecialPredicate);

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

const allHonorsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        return allHonorsPredicate(meldBasedWinningHand, honorTileIndices)
    };

const allHonorsSpecialPredicate : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allHonorsPredicate(specialWinningHand)
    };

export const ALL_HONORS_PREDICATE : PointPredicate<WinningHand> = 
    createPointPredicateRouter(allHonorsMeldBasedPredicate, allHonorsSpecialPredicate);

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
    );
}

const voidedSuitMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
        const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
        const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        
        return voidedSuitPredicate(meldBasedWinningHand, suitedTileIndices);
    };

const voidedSuitSpecialPredicate : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return voidedSuitPredicate(specialWinningHand);
    };

export const VOIDED_SUIT_PREDICATE : PointPredicate<WinningHand> = 
    createPointPredicateRouter(voidedSuitMeldBasedPredicate, voidedSuitSpecialPredicate);

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

const allTerminalsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
        const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        return allTerminalsPredicate(meldBasedWinningHand, terminalIndices);
    };

const allTerminalsSpecialPredicate : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allTerminalsPredicate(specialWinningHand);
    };

export const ALL_TERMINALS_PREDICATE : PointPredicate<WinningHand> = 
    createPointPredicateRouter(allTerminalsMeldBasedPredicate, allTerminalsSpecialPredicate);

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

const allHonorsAndTerminalsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
        const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
        const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
        
        return allHonorsAndTerminalsPredicate(meldBasedWinningHand, consolidateSets([terminalIndices, honorTileIndices]));
    };

const allHonorsAndTerminalsSpecialPredicate : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allHonorsAndTerminalsPredicate(specialWinningHand);
    };

export const ALL_HONORS_AND_TERMINALS_PREDICATE : PointPredicate<WinningHand> = 
    createPointPredicateRouter(allHonorsAndTerminalsMeldBasedPredicate, allHonorsAndTerminalsSpecialPredicate);

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

const allSimplesMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand : MeldBasedWinningHand) => {
        const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
        const simplesIndices = consolidateSets([...simpleSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)))
        return allSimplesPredicate(meldBasedWinningHand, simplesIndices);
    };

const allSimplesSpecialPredicate : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand : SpecialWinningHand) => {
        return allSimplesPredicate(specialWinningHand);
    };

export const ALL_SIMPLES_SPECIAL_PREDICATE : PointPredicate<WinningHand> = 
    createPointPredicateRouter(allSimplesMeldBasedPredicate, allSimplesSpecialPredicate);

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

export function allGivenSuitAndGivenDragonPredicate(pointPredicateId: string, meldBasedWinningHand: MeldBasedWinningHand, 
    givenSuitedTileGroup: SuitedTileGroup, givenDragonTileValue: DragonTileValue) : PointPredicateResult {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
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
                    .meldsThatSatisfyPredicate(getMeldsSubsetFromIndicesSet(meldBasedWinningHand.melds, indices))
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

    const failedTiles : SuitedOrHonorTile[][] = [];
    const missingTiles : SuitedOrHonorTile[][] = [];
    if (suitedTileGroups.size > 1) {
        failedTiles.push(...suitedTilesSepBySuit.filter(suitedTileList => !!suitedTileList[0] && suitedTileList[0].group !== givenSuitedTileGroup));
    } else if (suitedTileGroups.size === 0) {
        missingTiles.push(getSuitedTilesForSuitedTileGroup(givenSuitedTileGroup));
    } else if (honorTileValues.size > 1) { 
        failedTiles.push(...honorTilesSepbyValue.filter(honorTileList => !!honorTileList[0] && honorTileList[0].value !== givenDragonTileValue));
    } else if (honorTileValues.size === 0) {
        missingTiles.push([constructHonorTile(TileGroup.DRAGON, givenDragonTileValue)]); 
    }
    const tileDetail = new PointPredicateFailureResultTileDetail.Builder();
    if (!!failedTiles) {
        tileDetail.tilesThatFailPredicate(failedTiles);
    }
    if (!!missingTiles) {
        tileDetail.tilesThatAreMissingToSatisfyPredicate(missingTiles);
    }
    return new PointPredicateFailureResult.Builder()
        .pointPredicateId(pointPredicateId)
        .tileDetail(tileDetail.build())
        .build();
}