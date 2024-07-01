import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { MeldType } from "model/meld/meldType";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export const PAIR_WAIT_PREDICATE : PointPredicate<StandardWinningHand> = (winningHand : StandardWinningHand) => {
    if (winningHand.meldWithWinningTile.type !== MeldType.PAIR) {
        return new PointPredicateResult(PointPredicateID.PAIR_WAIT, false, [], [winningHand.meldWithWinningTile.tiles], [], new Set(), []);
    }

    throw new Error("Not implemented.");
}   