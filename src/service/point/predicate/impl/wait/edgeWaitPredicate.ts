import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedTileValue } from "model/tile/tileValue";
import { meldIsChow } from "model/meld/chow";
import { Chow } from "model/meld/chow";
import { PointPredicateFailureResult, PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultMeldDetailBuilder } from "model/point/predicate/result/meldBased/pointPredicateFailureResultMeldDetail";
import { PointPredicateFailureResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { Meld } from "model/meld/meld";
import { Tile } from "model/tile/tile";

export const EDGE_WAIT_PREDICATE : PointPredicate<MeldBasedWinningHand> = (winningHand : MeldBasedWinningHand) => {
    if (!meldIsChow(winningHand.meldWithWinningTile)) {
        return createEdgeWaitFailureResult(winningHand.meldWithWinningTile);
    }
    const chow : Chow = winningHand.meldWithWinningTile;
    if (!(chow.tiles[0].value === SuitedTileValue.ONE && chow.tiles[1].value === SuitedTileValue.TWO && chow.tiles[2].value === SuitedTileValue.THREE) &&
    !(chow.tiles[0].value === SuitedTileValue.SEVEN && chow.tiles[1].value === SuitedTileValue.EIGHT && chow.tiles[2].value === SuitedTileValue.NINE)) {
        return createEdgeWaitFailureResult(winningHand.meldWithWinningTile);
    }

    if (chow.isKnitted()) {
        return createEdgeWaitFailureResult(winningHand.meldWithWinningTile);
    }

    if (winningHand.winningTile.value !== SuitedTileValue.ONE && winningHand.winningTile.value !== SuitedTileValue.NINE) {
        // we put the winning tile as the failed tile as the meld itself is fine, it's just that the winning tile is the wrong one.
        createEdgeWaitFailureResult(winningHand.meldWithWinningTile, winningHand.winningTile);
    }

    throw new Error("Not implemented.");

    // TODO get index of meld with winning tile?
    // return new PointPredicateResult(PointPredicateID.EDGE_WAIT, true, [[winningHand.meldWithWinningTile.tiles]], [], new Set(new Set()), []);
}

function createEdgeWaitFailureResult(meld: Meld, tile?: Tile) : PointPredicateFailureResult {
    const resultBuilder = new PointPredicateFailureResultBuilder()
        .pointPredicateId(PointPredicateID.EDGE_WAIT)
        .meldDetail(
            new PointPredicateFailureResultMeldDetailBuilder()
            .meldsThatFailPredicate([meld])
            .build()
        );
    if (!tile) {
        return resultBuilder.build();
    }
    return resultBuilder
        .tileDetail(
            new PointPredicateFailureResultTileDetailBuilder()
            .tilesThatFailPredicate([[tile]])
            .build()
        )
        .build();
}