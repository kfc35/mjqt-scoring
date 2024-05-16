import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { MeldType } from "model/meld/meldType";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export const PAIR_WAIT_PREDICATE : PointPredicate<StandardWinningHand> = (winningHand : StandardWinningHand) => {
    if (winningHand.meldWithWinningTile.type !== MeldType.PAIR) {
        return new PointPredicateResult(PointPredicateID.PAIR_WAIT, false, [], [winningHand.meldWithWinningTile.tiles], new Set(), []);
    }
    // Must check for all other combination waits.
    // If it is a suited tile: 
      // if there is an unexposed sequence before or after, there was a multi pair wait. (more than one pair wait)
      // if there is an unexposed pong for the number before or after, there was a multi wait. (edge | two sided + pair)
      // if there is an unexposed pong for the number two before or two after, there was a multi wait. (closed + pair)
      // if there is a chow that includes this number with space for the number after (for a greater value chow) or before (for a lower value chow), there was a multiwait.
      // check for complex dual entatsu.
    // nine gates?
}   