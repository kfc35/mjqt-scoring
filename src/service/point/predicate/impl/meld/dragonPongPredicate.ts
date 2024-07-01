import { DRAGON_TILES, GREEN_DRAGON, RED_DRAGON, WHITE_DRAGON } from "common/deck";
import { createPongOrKongsExistPredicate } from "service/point/predicate/factory/meld/pongOrKongPredicateFactory";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";

export const RED_DRAGON_PONG_KONG_PREDICATE: PointPredicate<StandardWinningHand> = createPongOrKongsExistPredicate(PointPredicateID.RED_DRAGON_PONG_KONG.valueOf(), [RED_DRAGON]);
export const GREEN_DRAGON_PONG_KONG_PREDICATE: PointPredicate<StandardWinningHand> = createPongOrKongsExistPredicate(PointPredicateID.GREEN_DRAGON_PONG_KONG.valueOf(), [GREEN_DRAGON]);
export const WHITE_DRAGON_PONG_KONG_PREDICATE: PointPredicate<StandardWinningHand> = createPongOrKongsExistPredicate(PointPredicateID.WHITE_DRAGON_PONG_KONG.valueOf(), [WHITE_DRAGON]);

export const BIG_THREE_DRAGONS_PREDICATE: PointPredicate<StandardWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.BIG_THREE_DRAGONS, DRAGON_TILES);