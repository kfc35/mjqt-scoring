import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { ALL_CHOWS_PREDICATE, ALL_KONGS_PREDICATE, ALL_PONGS_AND_KONGS_PREDICATE, COMMON_HAND_PREDICATE, SEVEN_PAIRS_PREDICATE } from "service/point/predicate/impl/hand/basicHandPredicate";
import { CONCEALED_HAND_PREDICATE, FULLY_CONCEALED_PREDICATE, SELF_TRIPLETS_PREDICATE } from "service/point/predicate/impl/hand/concealedHandPredicate";
import { FULLY_MELDED_HAND_PREDICATE, MELDED_HAND_PREDICATE } from "service/point/predicate/impl/hand/meldedHandPredicate";
import { JADE_DRAGON_PREDICATE, PEARL_DRAGON_PREDICATE, RUBY_DRAGON_PREDICATE } from "service/point/predicate/impl/hand/jewelDragonPredicate";
import { NINE_GATES_PREDICATE } from "service/point/predicate/impl/hand/nineGatesPredicate";
import { THIRTEEN_ORPHANS_PREDICATE } from "service/point/predicate/impl/hand/thirteenOrphansPredicate";

export default function createFlowerPointPredicateWiring(): Map<PointPredicateID, PointPredicate<WinningHand>> {
    const map: Map<PointPredicateID, PointPredicate<WinningHand>> = new Map();

    map.set(PointPredicateID.SEVEN_PAIRS, SEVEN_PAIRS_PREDICATE);
    map.set(PointPredicateID.ALL_CHOWS, ALL_CHOWS_PREDICATE);
    map.set(PointPredicateID.ALL_PONGS_AND_KONGS, ALL_PONGS_AND_KONGS_PREDICATE);
    map.set(PointPredicateID.ALL_KONGS, ALL_KONGS_PREDICATE);
    map.set(PointPredicateID.COMMON_HAND, COMMON_HAND_PREDICATE);

    map.set(PointPredicateID.JADE_DRAGON, JADE_DRAGON_PREDICATE);
    map.set(PointPredicateID.RUBY_DRAGON, RUBY_DRAGON_PREDICATE);
    map.set(PointPredicateID.PEARL_DRAGON, PEARL_DRAGON_PREDICATE);

    map.set(PointPredicateID.CONCEALED_HAND, CONCEALED_HAND_PREDICATE);
    map.set(PointPredicateID.FULLY_CONCEALED_HAND, FULLY_CONCEALED_PREDICATE);
    map.set(PointPredicateID.SELF_TRIPLETS, SELF_TRIPLETS_PREDICATE);
    map.set(PointPredicateID.MELDED_HAND, MELDED_HAND_PREDICATE);
    map.set(PointPredicateID.FULLY_MELDED_HAND, FULLY_MELDED_HAND_PREDICATE);

    map.set(PointPredicateID.NINE_GATES, NINE_GATES_PREDICATE);
    map.set(PointPredicateID.THIRTEEN_ORPHANS, THIRTEEN_ORPHANS_PREDICATE);
    
    return map;
}
