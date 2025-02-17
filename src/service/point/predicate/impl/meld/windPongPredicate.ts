import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import WinContext from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { createPongOrKongsExistPredicate } from "service/point/predicate/factory/meldBased/pongOrKongPredicateFactory";
import { WIND_TILES } from "common/deck";
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";

export const SEAT_WIND_PONG_KONG_PREDICATE : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand, winContext: WinContext, roundContext: RoundContext, config: RootPointPredicateConfiguration) => {
        const seatWindPredicate = createPongOrKongsExistPredicate(PointPredicateID.SEAT_WIND_PONG_KONG, [roundContext.getSeatWindAsWindTile()]);
        return seatWindPredicate(standardWinningHand, winContext, roundContext, config);
    }

export const PREVAILING_WIND_PONG_KONG_PREDICATE : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand, winContext: WinContext, roundContext: RoundContext, config: RootPointPredicateConfiguration) => {
        const prevailingWindPredicate = createPongOrKongsExistPredicate(PointPredicateID.PREVAILING_WIND_PONG_KONG, [roundContext.getPrevailingWindAsWindTile()]);
        return prevailingWindPredicate(standardWinningHand, winContext, roundContext, config);
    }

export const BIG_FOUR_WINDS_PREDICATE: PointPredicate<MeldBasedWinningHand> = 
    createPongOrKongsExistPredicate(PointPredicateID.BIG_FOUR_WINDS, WIND_TILES);