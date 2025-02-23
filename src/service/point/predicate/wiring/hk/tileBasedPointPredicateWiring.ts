import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { ALL_ONE_SUIT_PREDICATE } from "service/point/predicate/impl/tileBased/allOneSuitPredicate";
import { ALL_ONE_SUIT_AND_HONORS_PREDICATE } from "service/point/predicate/impl/tileBased/allOneSuitAndHonorsPredicate";
import { ALL_HONORS_PREDICATE } from "service/point/predicate/impl/tileBased/allHonorsPredicate";
import { ALL_TERMINALS_PREDICATE } from "service/point/predicate/impl/tileBased/allTerminalsPredicate";
import { ALL_HONORS_AND_TERMINALS_PREDICATE } from "service/point/predicate/impl/tileBased/allHonorsAndTerminalsPredicate";
import { ALL_SIMPLES_SPECIAL_PREDICATE } from "service/point/predicate/impl/tileBased/allSimplesPredicate";
import { VOIDED_SUIT_PREDICATE } from "service/point/predicate/impl/tileBased/voidedSuitPredicate";

export default function createTileBasedPointPredicateWiring(): Map<PointPredicateID, PointPredicate<WinningHand>> {
    const map: Map<PointPredicateID, PointPredicate<WinningHand>> = new Map();

    map.set(PointPredicateID.ALL_ONE_SUIT, ALL_ONE_SUIT_PREDICATE);
    map.set(PointPredicateID.ALL_ONE_SUIT_AND_HONORS, ALL_ONE_SUIT_AND_HONORS_PREDICATE);
    map.set(PointPredicateID.ALL_HONORS, ALL_HONORS_PREDICATE);
    map.set(PointPredicateID.ALL_TERMINALS, ALL_TERMINALS_PREDICATE);
    map.set(PointPredicateID.ALL_HONORS_AND_TERMINALS, ALL_HONORS_AND_TERMINALS_PREDICATE);
    map.set(PointPredicateID.ALL_SIMPLES, ALL_SIMPLES_SPECIAL_PREDICATE);
    map.set(PointPredicateID.VOIDED_SUIT, VOIDED_SUIT_PREDICATE);

    return map;
}