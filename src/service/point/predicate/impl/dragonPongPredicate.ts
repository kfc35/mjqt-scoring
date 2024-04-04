import { GREEN_DRAGON, RED_DRAGON, WHITE_DRAGON } from "common/deck";
import { createPongEqualityPredicate } from "service/point/predicate/factory/pongPredicate"
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export const RED_DRAGON_PONG_PREDICATE = createPongEqualityPredicate(PointPredicateID.RED_DRAGON_PONG.valueOf(), [RED_DRAGON]);
export const GREEN_DRAGON_PONG_PREDICATE = createPongEqualityPredicate(PointPredicateID.GREEN_DRAGON_PONG.valueOf(), [GREEN_DRAGON]);
export const WHITE_DRAGON_PONG_PREDICATE = createPongEqualityPredicate(PointPredicateID.WHITE_DRAGON_PONG.valueOf(), [WHITE_DRAGON]);