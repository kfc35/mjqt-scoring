import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { meldIsChow } from "model/meld/chow";
import Chow from "model/meld/chow";

export const CLOSED_WAIT_PREDICATE : PointPredicate<MeldBasedWinningHand> = (winningHand : MeldBasedWinningHand) => {
    if (!meldIsChow(winningHand.meldWithWinningTile)) {
        return new PointPredicateResult(PointPredicateID.EDGE_WAIT, false, [], [winningHand.meldWithWinningTile.tiles], [], new Set(), []);
    }
    const chow : Chow = winningHand.meldWithWinningTile;
    if (chow.isKnitted()) {
        return new PointPredicateResult(PointPredicateID.EDGE_WAIT, false, [], [winningHand.meldWithWinningTile.tiles], [], new Set(), []);
    }

    if (winningHand.winningTile.value !== chow.tiles[1].value) {
        // we put the winning tile as the failed tile. the meld itself is fine, it's just that the winning tile is the wrong one.
        return new PointPredicateResult(PointPredicateID.EDGE_WAIT, false, [], [[winningHand.winningTile]], [], new Set(), []);
    }

    throw new Error("Not implemented.");

    // TODO get index of meld with winning tile?
    // return new PointPredicateResult(PointPredicateID.EDGE_WAIT, true, [[winningHand.meldWithWinningTile.tiles]], [], new Set(new Set()), []);
}