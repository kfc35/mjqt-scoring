import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPPResultBasedOnBooleanFlagWithTileDetail } from "service/point/predicate/impl/util/pointPredicateUtil";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateSuccessResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateFailureResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";

export const notSelfDrawSubPredicate : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW, !winningHand.isSelfDrawn(), 
        new PointPredicateSuccessResultTileDetailBuilder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
        new PointPredicateFailureResultTileDetailBuilder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }