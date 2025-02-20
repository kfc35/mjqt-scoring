import { TERMINAL_TILES } from "common/deck";
import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { terminalSuitedTileValues, SuitedTileValue } from "model/tile/tileValue";
import { PointPredicate } from "../../pointPredicate";
import PointPredicateSuccessResultMeldDetail from "../../result/meldBased/pointPredicateSuccessResultMeldDetail";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateResult from "../../result/pointPredicateResult";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import { createPointPredicateRouter } from "../util/pointPredicateUtil";

function allTerminalsPredicate(winningHand: WinningHand, terminalsIndicesSet: Set<number> = new Set()): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
    if (suitedTileValues.size <= terminalSuitedTileValues.size &&
        [...suitedTileValues.keys()].every(stv => terminalSuitedTileValues.has(stv)) &&
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

const allTerminalsMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)));
    return allTerminalsPredicate(meldBasedWinningHand, terminalIndices);
};

const allTerminalsSpecialPredicate: PointPredicate<SpecialWinningHand> = (specialWinningHand: SpecialWinningHand) => {
    return allTerminalsPredicate(specialWinningHand);
};

export const ALL_TERMINALS_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouter(allTerminalsMeldBasedPredicate, allTerminalsSpecialPredicate);