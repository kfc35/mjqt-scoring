import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { meldIsKong } from "model/meld/kong";
import { createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";

export function createKongQuantityPredicate(pointPredicateID : string, minNumKongs: number, maxNumKongs: number | undefined = minNumKongs) : PointPredicate<MeldBasedWinningHand> {
    return createMeldCheckerSuccessesQuantityPredicate(pointPredicateID, meldIsKong, minNumKongs, maxNumKongs);
}