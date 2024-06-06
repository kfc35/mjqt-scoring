import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { createPairQuantityPredicate } from "service/point/predicate/factory/pairPredicateFactory";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createChowMinQuantityPredicate } from "service/point/predicate/factory/chowPredicateFactory";
import { createKongMinQuantityPredicate } from "service/point/predicate/factory/kongPredicateFactory";

const onePairPredicate : PointPredicate<StandardWinningHand> = createPairQuantityPredicate(PointPredicateID.ONE_PAIR, 1, 1);
const atLeastFourChowsPredicate : PointPredicate<StandardWinningHand> = createChowMinQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_CHOWS, 4);
const atLeastFourKongsPredicate : PointPredicate<StandardWinningHand> = createKongMinQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_KONGS, 4);

export const SEVEN_PAIRS_PREDICATE : PointPredicate<StandardWinningHand> = createPairQuantityPredicate(PointPredicateID.SEVEN_PAIRS, 7, 7);

export const ALL_CHOWS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_CHOWS, onePairPredicate, atLeastFourChowsPredicate);

export const ALL_KONGS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_KONGS, onePairPredicate, atLeastFourKongsPredicate);

// TODO CONCEALED_HAND, MELDED_HAND, ALL_PONGS_AND_KONGS, SELF_TRIPLETS