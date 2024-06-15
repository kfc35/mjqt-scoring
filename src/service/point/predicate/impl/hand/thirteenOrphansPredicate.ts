import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";

export const THIRTEEN_ORPHANS_PREDICATE : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand: SpecialWinningHand) => {
        if (specialWinningHand.specialWinningHandType === SpecialWinningHandType.THIRTEEN_ORPHANS) {
            return new PointPredicateResult(PointPredicateID.THIRTEEN_ORPHANS, true, [specialWinningHand.getTiles()], [], new Set(), []);
        }
        return new PointPredicateResult(PointPredicateID.THIRTEEN_ORPHANS, false, [], [], new Set(), []);
    }