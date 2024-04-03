import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Pong from "model/meld/pong";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { RoundContext } from "model/roundContext/roundContext";
import WindTile from "model/tile/group/windTile";

export default function createPongPredicate(pointPredicateID : PointPredicateID, tile: SuitedOrHonorTile) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const pong = new Pong(tile);
        for (const meld of winningHand.getContents()) {
            if (meld.equals(pong, true)) {
                return new PointPredicateResult(pointPredicateID, true, [meld]);
            }
        }
        return new PointPredicateResult(pointPredicateID, false, []);
    }
}

export function createWindPongPredicates(roundContext: RoundContext) : [PointPredicate<StandardWinningHand>, PointPredicate<StandardWinningHand>] {
    const prevailingWindTile : WindTile = roundContext.getPrevailingWindAsWindTile();
    const seatWindTile : WindTile = roundContext.getSeatWindAsWindTile();

    return [createPongPredicate(PointPredicateID.PREVAILING_WIND_PONG, prevailingWindTile), 
        createPongPredicate(PointPredicateID.SEAT_WIND_PONG, seatWindTile)];
}