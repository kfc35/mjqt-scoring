import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultTileDetail } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { handContainsHonorsSubPredicate } from "service/point/predicate/impl/tileBased/tileBasedSharedSubPredicate";

function handContainsNoSuitsSubPredicate(winningHand: WinningHand): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    if (suitedTileGroups.size === 0) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)
            .build();
    } else {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatFailPredicate(tilesSepBySuit)
                    .build()
            )
            .build();
    }
}

export const ALL_HONORS_PREDICATE: PointPredicate<WinningHand> = predicateAnd(PointPredicateID.ALL_HONORS,
    handContainsNoSuitsSubPredicate, handContainsHonorsSubPredicate);