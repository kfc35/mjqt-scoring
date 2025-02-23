import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { meldIsChow } from "model/meld/chow";
import Chow from "model/meld/chow";
import Meld from "model/meld/meld";
import { Tile } from "model/tile/tile";
import PointPredicateFailureResult from "service/point/predicate/result/pointPredicateFailureResult";
import PointPredicateFailureResultMeldDetail from "service/point/predicate/result/meldBased/pointPredicateFailureResultMeldDetail";
import PointPredicateFailureResultTileDetail from "service/point/predicate/result/tile/pointPredicateFailureResultTileDetail";

export const CLOSED_WAIT_PREDICATE : PointPredicate<MeldBasedWinningHand> = (winningHand : MeldBasedWinningHand) => {
    if (!meldIsChow(winningHand.meldWithWinningTile)) {
        return createClosedWaitFailureResult(winningHand.meldWithWinningTile);
    }
    const chow : Chow = winningHand.meldWithWinningTile;
    if (chow.isKnitted()) {
        return createClosedWaitFailureResult(winningHand.meldWithWinningTile);
    }

    if (winningHand.winningTile.value !== chow.tiles[1].value) {
        // we put the winning tile as the failed tile. the meld itself is fine, it's just that the winning tile is the wrong one.
        return createClosedWaitFailureResult(winningHand.meldWithWinningTile, winningHand.winningTile);
    }

    throw new Error("Not implemented.");

    // TODO get index of meld with winning tile?
    // return new PointPredicateResult(PointPredicateID.EDGE_WAIT, true, [[winningHand.meldWithWinningTile.tiles]], [], new Set(new Set()), []);
}

function createClosedWaitFailureResult(meld: Meld, tile?: Tile) : PointPredicateFailureResult {
    const resultBuilder = new PointPredicateFailureResult.Builder()
        .pointPredicateId(PointPredicateID.CLOSED_WAIT)
        .meldDetail(
            new PointPredicateFailureResultMeldDetail.Builder()
            .meldsThatFailPredicate([meld])
            .build()
        );
    if (!tile) {
        return resultBuilder.build();
    }
    return resultBuilder
        .tileDetail(
            new PointPredicateFailureResultTileDetail.Builder()
            .tilesThatFailPredicate([[tile]])
            .build()
        )
        .build();
}