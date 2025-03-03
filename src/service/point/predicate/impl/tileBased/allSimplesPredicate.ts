import { SIMPLE_TILES } from "common/deck";
import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { simpleSuitedTileValues, SuitedTileValue } from "model/tile/tileValue";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultTileDetail } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateSuccessResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultTileDetail } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { createPointPredicateRouter } from "service/point/predicate/impl/util/pointPredicateUtil";
import { partitionTilesByGroup } from "common/tileUtils";

function allSimplesPredicate(winningHand: WinningHand, simplesIndicesSet: Set<number> = new Set()): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileValues: Set<SuitedTileValue> = tileGroupValueMaps.getSuitedTileValues();
    if ([...suitedTileValues.keys()].every(stv => simpleSuitedTileValues.has(stv)) &&
        suitedTileValues.size > 0 &&
        tileGroupValueMaps.getHonorTileGroups().size === 0) {
        const simpleTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(suitedTileValues);

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

    const honorTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(tileGroupValueMaps.getHonorTileGroups());
    const nonSimpleTileValues: Set<SuitedTileValue> = new Set([...suitedTileValues].filter(stv => !simpleSuitedTileValues.has(stv)));
    const nonSimpleTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(nonSimpleTileValues).filter(tiles => tiles.length > 0);
    const tileDetail = new PointPredicateFailureResultTileDetail.Builder()
        .tilesThatFailPredicate([...honorTiles, ...nonSimpleTiles]);
    if (([...suitedTileValues].filter(stv => simpleSuitedTileValues.has(stv))).length === 0) {
        tileDetail.tilesThatAreMissingAnyOfToSatisfyPredicate(partitionTilesByGroup(SIMPLE_TILES));
    }
    

    return new PointPredicateFailureResult.Builder()
        .pointPredicateId(PointPredicateID.ALL_SIMPLES)
        .tileDetail(tileDetail.build())
        .build();
}

const allSimplesMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const simplesIndices = consolidateSets([...simpleSuitedTileValues.keys()].map(stv => tileGroupValueMaps.getMeldIndicesForSuitedTileValue(stv)));
    return allSimplesPredicate(meldBasedWinningHand, simplesIndices);
};

const allSimplesSpecialPredicate: PointPredicate<SpecialWinningHand> = (specialWinningHand: SpecialWinningHand) => {
    return allSimplesPredicate(specialWinningHand);
};

export const ALL_SIMPLES_SPECIAL_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouter(allSimplesMeldBasedPredicate, allSimplesSpecialPredicate);