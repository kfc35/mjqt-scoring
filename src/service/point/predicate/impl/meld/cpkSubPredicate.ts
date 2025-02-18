import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createChowMinQuantityPredicate } from "../../factory/meldBased/chowPredicateFactory";
import { PointPredicate } from "../../pointPredicate";
import { createKongMinQuantityPredicate } from "../../factory/meldBased/kongPredicateFactory";
import { meldIsKong } from "model/meld/kong";
import { meldIsPong } from "model/meld/pong";
import { createMeldCheckerSuccessesQuantityPredicate } from "../../factory/meldBased/meldPredicateFactoryBase";

export const atLeastFourChowsSubPredicate: PointPredicate<MeldBasedWinningHand> = createChowMinQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CHOWS, 4);
export const atLeastFourKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createKongMinQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_KONGS, 4);
export const atLeastFourPongsKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createMeldCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_PONGS_AND_KONGS, meld => meldIsKong(meld) || meldIsPong(meld), 4);

