import { GREEN_DRAGON, RED_DRAGON, WHITE_DRAGON } from "common/deck";
import { createPongsExistPredicate } from "service/point/predicate/factory/pongPredicateFactory"
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";

export const RED_DRAGON_PONG_PREDICATE: PointPredicate<StandardWinningHand> = createPongsExistPredicate(PointPredicateID.RED_DRAGON_PONG.valueOf(), [RED_DRAGON]);
export const GREEN_DRAGON_PONG_PREDICATE: PointPredicate<StandardWinningHand> = createPongsExistPredicate(PointPredicateID.GREEN_DRAGON_PONG.valueOf(), [GREEN_DRAGON]);
export const WHITE_DRAGON_PONG_PREDICATE: PointPredicate<StandardWinningHand> = createPongsExistPredicate(PointPredicateID.WHITE_DRAGON_PONG.valueOf(), [WHITE_DRAGON]);