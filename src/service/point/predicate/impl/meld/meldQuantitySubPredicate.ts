import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { createFilteredMeldsCheckerPredicate } from "../../factory/meldBased/meldPredicateFactoryBase";
import { meldIsChow } from "model/meld/chow";
import { meldIsPong } from "model/meld/pong";
import { meldIsKong } from "model/meld/kong";

export const atLeastNumMeldsMinusOneAreChowsSubPredicate: PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CHOWS, 
    meld => meldIsChow(meld), (melds, winningHand) => melds.length >= winningHand.melds.length - 1, () => true);
export const atLeastNumMeldsMinusOneAreKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_KONGS, 
    meld => meldIsKong(meld), (melds, winningHand) => melds.length >= winningHand.melds.length - 1, () => true);
export const atLeastNumMeldsMinusOneArePongsKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_PONGS_AND_KONGS, 
    meld => meldIsKong(meld) || meldIsPong(meld), (melds, winningHand) => melds.length >= winningHand.melds.length - 1, () => true);
