import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedTileValue } from "model/tile/tileValue";
import { meldIsChow } from "model/meld/chow";
import Chow from "model/meld/chow";

export const EDGE_WAIT_PREDICATE : PointPredicate<StandardWinningHand> = (winningHand : StandardWinningHand) => {
    if (!meldIsChow(winningHand.meldWithWinningTile)) {
        return new PointPredicateResult(PointPredicateID.EDGE_WAIT, false, [], [winningHand.meldWithWinningTile.tiles], [], new Set(), []);
    }
    const chow : Chow = winningHand.meldWithWinningTile;
    if (!(chow.tiles[0].value === SuitedTileValue.ONE && chow.tiles[1].value === SuitedTileValue.TWO && chow.tiles[2].value === SuitedTileValue.THREE) &&
    !(chow.tiles[0].value === SuitedTileValue.SEVEN && chow.tiles[1].value === SuitedTileValue.EIGHT && chow.tiles[2].value === SuitedTileValue.NINE)) {
        return new PointPredicateResult(PointPredicateID.EDGE_WAIT, false, [], [winningHand.meldWithWinningTile.tiles], [], new Set(), []);
    }

    if (chow.isKnitted()) {
        return new PointPredicateResult(PointPredicateID.EDGE_WAIT, false, [], [winningHand.meldWithWinningTile.tiles], [], new Set(), []);
    }

    if (winningHand.winningTile.value !== SuitedTileValue.ONE && winningHand.winningTile.value !== SuitedTileValue.NINE) {
        // we put the winning tile as the failed tile as the meld itself is fine, it's just that the winning tile is the wrong one.
        return new PointPredicateResult(PointPredicateID.EDGE_WAIT, false, [], [[winningHand.winningTile]], [], new Set(), []);
    }

    throw new Error("Not implemented.");

    // TODO get index of meld with winning tile?
    // return new PointPredicateResult(PointPredicateID.EDGE_WAIT, true, [[winningHand.meldWithWinningTile.tiles]], [], new Set(new Set()), []);
}