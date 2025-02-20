import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { meldIsPong } from "model/meld/pong";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";

export function createPongQuantityPredicate(pointPredicateID : string, minNumPongs?: number, maxNumPongs: number | undefined = minNumPongs) : PointPredicate<MeldBasedWinningHand> {
    return createMeldCheckerSuccessesQuantityPredicate(pointPredicateID, meldIsPong, minNumPongs, maxNumPongs);
}