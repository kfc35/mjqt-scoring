import { DRAGON_TILES, GREEN_DRAGON, RED_DRAGON, WHITE_DRAGON } from "common/deck";
import { createPongOrKongsExistPredicate } from "service/point/predicate/factory/meldBased/pongOrKongPredicateFactory";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "service/point/predicate/impl/util/pointPredicateUtil";
import { dragonPairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { predicateAnd } from "service/point/predicate/pointPredicate";

const redDragonPongKongMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.RED_DRAGON_PONG_KONG, [RED_DRAGON], 1, 1);
const greenDragonPongKongMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.GREEN_DRAGON_PONG_KONG, [GREEN_DRAGON], 1, 1);
const whiteDragonPongKongMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.WHITE_DRAGON_PONG_KONG, [WHITE_DRAGON], 1, 1);

const twoDragonsPongKongSubPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.SUBPREDICATE_TWO_DRAGONS_PONG_KONG, DRAGON_TILES, 2, 2);
const smallThreeDragonsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.SMALL_THREE_DRAGONS, dragonPairSubPredicate, twoDragonsPongKongSubPredicate);

const bigThreeDragonsMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.BIG_THREE_DRAGONS, DRAGON_TILES, 3, 3);


export const RED_DRAGON_PONG_KONG_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.RED_DRAGON_PONG_KONG, redDragonPongKongMeldBasedPredicate);
export const GREEN_DRAGON_PONG_KONG_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.GREEN_DRAGON_PONG_KONG, greenDragonPongKongMeldBasedPredicate);
export const WHITE_DRAGON_PONG_KONG_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.WHITE_DRAGON_PONG_KONG, whiteDragonPongKongMeldBasedPredicate);
export const SMALL_THREE_DRAGONS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.SMALL_THREE_DRAGONS, smallThreeDragonsMeldBasedPredicate);
export const BIG_THREE_DRAGONS_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.BIG_THREE_DRAGONS, bigThreeDragonsMeldBasedPredicate);
