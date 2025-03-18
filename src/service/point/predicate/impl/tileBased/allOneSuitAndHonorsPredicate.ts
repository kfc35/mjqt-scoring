import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { handContainsOneSuitSubPredicate, handContainsHonorsSubPredicate } from "service/point/predicate/impl/tileBased/tileBasedSharedSubPredicate";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";

export const ALL_ONE_SUIT_AND_HONORS_PREDICATE: PointPredicate<WinningHand> = predicateAnd(PointPredicateID.ALL_ONE_SUIT_AND_HONORS,
    handContainsOneSuitSubPredicate, handContainsHonorsSubPredicate);