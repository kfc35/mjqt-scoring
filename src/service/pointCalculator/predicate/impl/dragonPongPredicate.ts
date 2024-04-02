import { GREEN_DRAGON, RED_DRAGON, WHITE_DRAGON } from "common/deck";
import createPongPredicate from "service/pointCalculator/predicate/factory/pongPredicate"
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export const RED_DRAGON_PONG_PREDICATE = createPongPredicate(PointPredicateID.RED_DRAGON_PONG, RED_DRAGON);
export const GREEN_DRAGON_PONG_PREDICATE = createPongPredicate(PointPredicateID.GREEN_DRAGON_PONG, GREEN_DRAGON);
export const WHITE_DRAGON_PONG_PREDICATE = createPongPredicate(PointPredicateID.WHITE_DRAGON_PONG, WHITE_DRAGON);