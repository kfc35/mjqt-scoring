import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { MeldType } from "model/meld/meldType";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export const PAIR_WAIT_PREDICATE : PointPredicate<MeldBasedWinningHand> = (winningHand : MeldBasedWinningHand) => {
    if (winningHand.meldWithWinningTile.type !== MeldType.PAIR) {
        return new PointPredicateResult(PointPredicateID.PAIR_WAIT, false, [], [winningHand.meldWithWinningTile.tiles], [], new Set(), []);
    }

    throw new Error("Not implemented.");
}   