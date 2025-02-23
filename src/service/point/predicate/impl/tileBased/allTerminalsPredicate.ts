import { TERMINAL_TILES } from "common/deck";
import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { terminalSuitedTileValues, SuitedTileValue } from "model/tile/tileValue";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import PointPredicateSingleSuccessResult from "service/point/predicate/result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultTileDetail from "service/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateSuccessResultMeldDetail from "service/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import PointPredicateFailureResult from "service/point/predicate/result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "service/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { createPointPredicateRouter } from "service/point/predicate/impl/util/pointPredicateUtil";
import { partitionTilesByGroup } from "common/tileUtils";

function allTerminalsPredicate(winningHand: WinningHand, terminalsIndicesSet: Set<number> = new Set()): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
    if ([...suitedTileValues].every(stv => terminalSuitedTileValues.has(stv)) &&
        suitedTileValues.size > 0 && 
        tileGroupValueMaps.getHonorTileGroups().size === 0) {
        const terminalTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);
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
    const honorTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
    const nonTerminalTileValues: Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !terminalSuitedTileValues.has(stv)));
    const nonTerminalTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonTerminalTileValues).filter(tiles => tiles.length > 0);
    const tileDetail = new PointPredicateFailureResultTileDetail.Builder()
            .tilesThatFailPredicate([...honorTiles, ...nonTerminalTiles]);
    if (([...suitedTileValues].filter(stv => terminalSuitedTileValues.has(stv))).length === 0) {
        tileDetail.tilesThatAreMissingAnyOfToSatisfyPredicate(partitionTilesByGroup(TERMINAL_TILES));
    }

    return new PointPredicateFailureResult.Builder()
        .pointPredicateId(PointPredicateID.ALL_TERMINALS)
        .tileDetail(tileDetail.build())
        .build();
}

const allTerminalsMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)));
    return allTerminalsPredicate(meldBasedWinningHand, terminalIndices);
};

const allTerminalsSpecialPredicate: PointPredicate<SpecialWinningHand> = (specialWinningHand: SpecialWinningHand) => {
    return allTerminalsPredicate(specialWinningHand);
};

export const ALL_TERMINALS_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouter(allTerminalsMeldBasedPredicate, allTerminalsSpecialPredicate);