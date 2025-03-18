import { HONOR_TILES, TERMINAL_TILES } from "common/deck";
import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { terminalSuitedTileValues, SuitedTileValue } from "model/tile/tileValue";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultTileDetail } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateSuccessResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultTileDetail } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { createPointPredicateRouter } from "service/point/predicate/impl/util/pointPredicateUtil";
import { partitionTilesByGroup } from "common/tileUtils";
import type { Tile } from "model/tile/tile";

function allHonorsAndTerminalsPredicate(winningHand: WinningHand, honorsAndTerminalsIndicesSet?: Set<number>): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues = tileGroupValueMaps.getSuitedTileValues();
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    if ([...suitedTileValues].every(stv => terminalSuitedTileValues.has(stv)) &&
        suitedTileValues.size > 0 && 
        honorTileGroups.size !== 0) {
        const terminalTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);
        const resultBuilder = new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.ALL_HONORS_AND_TERMINALS)
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([...terminalTiles, ...honorTiles])
                    .build()
            );
        if (honorsAndTerminalsIndicesSet) {
            resultBuilder.meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldIndicesThatSatisfyPredicate(honorsAndTerminalsIndicesSet)
                    .build()
            );
        }
        return resultBuilder.build();
    }

    const nonTerminalTileValues: Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !terminalSuitedTileValues.has(stv)));
    const nonTerminalTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonTerminalTileValues).filter(tiles => tiles.length > 0);
    const missingAnyOf: Tile[] = [];
    if (honorTileGroups.size === 0 ) {
        missingAnyOf.push(...HONOR_TILES);
    }
    if (([...suitedTileValues].filter(stv => terminalSuitedTileValues.has(stv))).length === 0) {
        missingAnyOf.push(...TERMINAL_TILES);
    }
    const tileDetail = new PointPredicateFailureResultTileDetail.Builder()
        .tilesThatFailPredicate(nonTerminalTiles);
    if (!!missingAnyOf && missingAnyOf.length > 0) {
        tileDetail.tilesThatAreMissingAnyOfToSatisfyPredicate(partitionTilesByGroup(missingAnyOf));
    }

    return new PointPredicateFailureResult.Builder()
        .pointPredicateId(PointPredicateID.ALL_HONORS_AND_TERMINALS)
        .tileDetail(tileDetail.build())
        .build();
}

const allHonorsAndTerminalsMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const terminalIndices = consolidateSets([...terminalSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)));
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));

    return allHonorsAndTerminalsPredicate(meldBasedWinningHand, consolidateSets([terminalIndices, honorTileIndices]));
};

const allHonorsAndTerminalsSpecialPredicate: PointPredicate<SpecialWinningHand> = (specialWinningHand: SpecialWinningHand) => {
    return allHonorsAndTerminalsPredicate(specialWinningHand);
};

export const ALL_HONORS_AND_TERMINALS_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouter(allHonorsAndTerminalsMeldBasedPredicate, allHonorsAndTerminalsSpecialPredicate);