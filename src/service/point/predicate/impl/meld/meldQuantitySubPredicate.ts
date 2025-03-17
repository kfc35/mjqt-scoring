import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { createFilteredMeldsCheckerSuccessesQuantityPredicate } from "../../factory/meldBased/meldPredicateFactoryBase";
import { meldIsPair } from "model/meld/pair";
import { meldIsChow } from "model/meld/chow";
import { meldIsPong } from "model/meld/pong";
import { meldIsKong } from "model/meld/kong";

export const containsFourChowsSubPredicate: PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CHOWS, 
        meld => !meldIsPair(meld), melds => melds.length === 4, meld => meldIsChow(meld));
export const containsFourKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length === 4, meld => meldIsKong(meld));
export const containsFourPongsKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_PONGS_AND_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length === 4, meld => meldIsKong(meld) || meldIsPong(meld));
