import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { createPairQuantityPredicate } from "service/point/predicate/factory/pairPredicateFactory";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createMeldsCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldPredicateFactoryBase";
import { meldIsPair } from "model/meld/pair";
import { meldIsChow } from "model/meld/chow";
import { meldIsKong } from "model/meld/kong";
import { meldIsPong } from "model/meld/pong";

const onePairPredicate : PointPredicate<StandardWinningHand> = createPairQuantityPredicate(PointPredicateID.ONE_PAIR, 1, 1);
const atLeastFourChowsPredicate : PointPredicate<StandardWinningHand> = createMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_CHOWS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4 && melds.every(meld => meldIsChow(meld)));
const atLeastFourKongsPredicate : PointPredicate<StandardWinningHand> = createMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4 && melds.every(meld => meldIsKong(meld)));
const atLeastFourPongsKongsPredicate : PointPredicate<StandardWinningHand> = createMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_PONGS_AND_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4 && melds.every(meld => meldIsKong(meld) || meldIsPong(meld)));
const atLeastFourConcealedPongsKongsPredicate : PointPredicate<StandardWinningHand> = createMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_CONCEALED_PONGS_AND_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4 && melds.every(meld => !meld.exposed && (meldIsKong(meld) || meldIsPong(meld))));
const atLeastFourConcealedNonPairMeldsPredicate : PointPredicate<StandardWinningHand> = createMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_CONCEALED_NON_PAIR_MELDS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4 && melds.every(meld => !meld.exposed));
const atLeastFourExposedNonPairMeldsPredicate : PointPredicate<StandardWinningHand> = createMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_EXPOSED_NON_PAIR_MELDS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4 && melds.every(meld => !meld.exposed));

export const SEVEN_PAIRS_PREDICATE : PointPredicate<StandardWinningHand> = createPairQuantityPredicate(PointPredicateID.SEVEN_PAIRS, 7, 7);

export const ALL_CHOWS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_CHOWS, onePairPredicate, atLeastFourChowsPredicate);

export const ALL_PONGS_AND_KONGS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_PONGS_AND_KONGS, onePairPredicate, atLeastFourPongsKongsPredicate);

export const ALL_KONGS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_KONGS, onePairPredicate, atLeastFourKongsPredicate);

export const SELF_TRIPLETS : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.SELF_TRIPLETS, onePairPredicate, atLeastFourConcealedPongsKongsPredicate);

// TODO CONCEALED_HAND, MELDED_HAND
/** 
export const CONCEALED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, pointPredicateConfiguration: PointPredicateConfiguration) {
        if (pointPredicateConfiguration.options())
    };

**/