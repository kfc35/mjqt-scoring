import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { MeldType } from "model/meld/meldType";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultMeldDetailBuilder } from "model/point/predicate/result/meldBased/pointPredicateFailureResultMeldDetail";

export const PAIR_WAIT_PREDICATE : PointPredicate<MeldBasedWinningHand> = (winningHand : MeldBasedWinningHand) => {
    if (winningHand.meldWithWinningTile.type !== MeldType.PAIR) {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.PAIR_WAIT)
            .meldDetail(
                new PointPredicateFailureResultMeldDetailBuilder()
                .meldsThatFailPredicate([winningHand.meldWithWinningTile])
                .build()
            )
            .build();
    }

    throw new Error("Not implemented.");
}   