import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { HONOR_TILES, SUITED_TILES } from "common/deck";
import { PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultTileDetail } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateSuccessResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultTileDetail } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { partitionTilesByGroup } from "common/tileUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { consolidateSets } from "common/generic/setUtils";

export function handContainsHonorsSubPredicate(winningHand: WinningHand) : PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles : SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    if (honorTileGroups.size > 0) {
        const resultBuilder = new PointPredicateSingleSuccessResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate(honorTiles)
                    .build()
            );
        if (winningHand instanceof MeldBasedWinningHand) {
            const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
            const honorTileIndices = consolidateSets([...honorTileGroups.values()]
                .map(tileGroup => winningHand.tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
            resultBuilder.meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldIndicesThatSatisfyPredicate(honorTileIndices)
                    .build()
            )
        }
        
        return resultBuilder.build();
    } else {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatAreMissingAnyOfToSatisfyPredicate(partitionTilesByGroup(HONOR_TILES))
                    .build()
            )
            .build();
    }
}

export function handContainsOneSuitSubPredicate(winningHand: WinningHand): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    if (suitedTileGroups.size === 1) {
        const resultBuilder = new PointPredicateSingleSuccessResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate(tilesSepBySuit)
                    .build()
            );
        if (winningHand instanceof MeldBasedWinningHand) {
            const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
            const suitedTileIndices: Set<number> = consolidateSets([...suitedTileGroups.values()]
                .map(tileGroup => winningHand.tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
            resultBuilder.meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldIndicesThatSatisfyPredicate(suitedTileIndices)
                    .build()
            )
        }
        return resultBuilder.build();
    } else if (suitedTileGroups.size > 1) {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatFailPredicate(tilesSepBySuit)
                    .build()
            )
            .build();
    } else {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatAreMissingAnyOfToSatisfyPredicate(partitionTilesByGroup(SUITED_TILES))
                    .build()
            )
            .build();
    }
}

export function handContainsMoreThanOneSuitSubPredicate(winningHand: WinningHand): PointPredicateResult {
     const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    if (suitedTileGroups.size > 1) {
        const resultBuilder = new PointPredicateSingleSuccessResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT)
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate(tilesSepBySuit)
                    .build()
            );
        if (winningHand instanceof MeldBasedWinningHand) {
            const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
            const suitedTileIndices: Set<number> = consolidateSets([...suitedTileGroups.values()]
                .map(tileGroup => winningHand.tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
            resultBuilder.meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldIndicesThatSatisfyPredicate(suitedTileIndices)
                    .build()
            )
        }
        return resultBuilder.build();
    } else if (suitedTileGroups.size === 1) {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatFailPredicate(tilesSepBySuit)
                    .build()
            )
            .build();
    } else {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatAreMissingAnyOfToSatisfyPredicate(partitionTilesByGroup(SUITED_TILES))
                    .build()
            )
            .build();
    }
}