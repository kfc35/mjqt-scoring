import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { createPongsExistPredicate } from "service/point/predicate/factory/meld/pongPredicateFactory";
import { PointPredicateConfiguration } from "service/point/predicate/configuration/pointPredicateConfiguration";

export const SEAT_WIND_PONG_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, roundContext: RoundContext, pointPredicateConfiguration: PointPredicateConfiguration) => {
        const seatWindPredicate = createPongsExistPredicate(PointPredicateID.SEAT_WIND_PONG, [roundContext.getSeatWindAsWindTile()]);
        return seatWindPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration);
    }

export const PREVAILING_WIND_PONG_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, roundContext: RoundContext, pointPredicateConfiguration: PointPredicateConfiguration) => {
        const prevailingWindPredicate = createPongsExistPredicate(PointPredicateID.PREVAILING_WIND_PONG, [roundContext.getPrevailingWindAsWindTile()]);
        return prevailingWindPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration);
    }