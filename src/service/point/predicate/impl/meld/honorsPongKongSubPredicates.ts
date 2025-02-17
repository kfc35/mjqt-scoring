import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { createPongOrKongsExistPredicate } from "service/point/predicate/factory/meldBased/pongOrKongPredicateFactory";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { DRAGON_TILES, WIND_TILES } from "common/deck";

export const twoDragonsPongKongSubPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.SUBPREDICATE_TWO_DRAGONS_PONG_KONG, DRAGON_TILES, 2);

export const threeWindsPongKongSubPredicate: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.SUBPREDICATE_THREE_WINDS_PONG_KONG, WIND_TILES, 3);

