import { DRAGON_TILES, GREEN_DRAGON, RED_DRAGON, WHITE_DRAGON } from "common/deck";
import { createPongOrKongsExistPredicate } from "service/point/predicate/factory/meldBased/pongOrKongPredicateFactory";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "../util/pointPredicateUtil";

const redDragonPongKongMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.RED_DRAGON_PONG_KONG, [RED_DRAGON]);
export const greenDragonPongKongMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.GREEN_DRAGON_PONG_KONG, [GREEN_DRAGON]);
export const whiteDragonPongKongMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.WHITE_DRAGON_PONG_KONG, [WHITE_DRAGON]);
export const bigThreeDragonsMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.BIG_THREE_DRAGONS, DRAGON_TILES);

export const RED_DRAGON_PONG_KONG_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.RED_DRAGON_PONG_KONG, redDragonPongKongMeldBasedPredicate);
export const GREEN_DRAGON_PONG_KONG_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.GREEN_DRAGON_PONG_KONG, greenDragonPongKongMeldBasedPredicate);
export const WHITE_DRAGON_PONG_KONG_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.WHITE_DRAGON_PONG_KONG, whiteDragonPongKongMeldBasedPredicate);
export const BIG_THREE_DRAGONS_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.BIG_THREE_DRAGONS, bigThreeDragonsMeldBasedPredicate);
