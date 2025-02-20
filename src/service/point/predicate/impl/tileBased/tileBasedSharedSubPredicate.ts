import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { HONOR_TILES, SUITED_TILES } from "common/deck";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateSuccessResultMeldDetail from "../../result/meldBased/pointPredicateSuccessResultMeldDetail";

export function handContainsHonorsSubPredicate(winningHand: WinningHand, honorTileIndicesSet: Set<number> = new Set()) : PointPredicateResult {
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

export function handContainsOneSuitSubPredicate(winningHand: WinningHand, suitedTileIndicesSet: Set<number> = new Set()): PointPredicateResult {
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