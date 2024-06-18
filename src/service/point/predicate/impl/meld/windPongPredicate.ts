import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { PointPredicateConfiguration } from "service/point/predicate/configuration/pointPredicateConfiguration";
import { createPongOrKongsExistPredicate } from "service/point/predicate/factory/meld/pongOrKongPredicateFactory";
import { WIND_TILES } from "common/deck";

export const SEAT_WIND_PONG_KONG_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, roundContext: RoundContext, pointPredicateConfiguration: PointPredicateConfiguration) => {
        const seatWindPredicate = createPongOrKongsExistPredicate(PointPredicateID.SEAT_WIND_PONG_KONG, [roundContext.getSeatWindAsWindTile()]);
        return seatWindPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration);
    }

export const PREVAILING_WIND_PONG_KONG_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, roundContext: RoundContext, pointPredicateConfiguration: PointPredicateConfiguration) => {
        const prevailingWindPredicate = createPongOrKongsExistPredicate(PointPredicateID.PREVAILING_WIND_PONG_KONG, [roundContext.getPrevailingWindAsWindTile()]);
        return prevailingWindPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration);
    }

export const threeWindsPongKongSubPredicate: PointPredicate<StandardWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.SUBPREDICATE_THREE_WINDS_PONG_KONG, WIND_TILES, 3);

export const BIG_FOUR_WINDS_PREDICATE: PointPredicate<StandardWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.BIG_FOUR_WINDS, WIND_TILES);