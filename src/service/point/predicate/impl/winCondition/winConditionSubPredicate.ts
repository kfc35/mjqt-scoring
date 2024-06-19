import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateResultBasedOnBooleanFlag } from "service/point/predicate/impl/util/pointPredicateUtil";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export const notSelfDrawSubPredicate : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW, !winningHand.isSelfDrawn(), [[winningHand.winningTile]]);
    }