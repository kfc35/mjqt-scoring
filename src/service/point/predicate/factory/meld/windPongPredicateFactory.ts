import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { RoundContext } from "model/roundContext/roundContext";
import WindTile from "model/tile/group/windTile";
import { createPongsExistPredicate } from "service/point/predicate/factory/meld/pongPredicateFactory";

export default function createWindPongsExistPredicates(roundContext: RoundContext) : [PointPredicate<StandardWinningHand>, PointPredicate<StandardWinningHand>] {
    const prevailingWindTile : WindTile = roundContext.getPrevailingWindAsWindTile();
    const seatWindTile : WindTile = roundContext.getSeatWindAsWindTile();

    return [createPongsExistPredicate(PointPredicateID.PREVAILING_WIND_PONG.valueOf(), [prevailingWindTile]), 
        createPongsExistPredicate(PointPredicateID.SEAT_WIND_PONG.valueOf(), [seatWindTile])];
}