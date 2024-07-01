import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { createPairQuantityPredicate } from "service/point/predicate/factory/meld/pairPredicateFactory";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { dragonPairSubPredicate, windPairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { twoDragonsPongKongSubPredicate, threeWindsPongKongSubPredicate } from "service/point/predicate/impl/meld/honorsPongKongSubPredicates";
import { atLeastFourChowsSubPredicate, atLeastFourKongsSubPredicate, atLeastFourPongsKongsSubPredicate } from "service/point/predicate/impl/hand/handSubPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";

export const SEVEN_PAIRS_PREDICATE : PointPredicate<StandardWinningHand> = createPairQuantityPredicate(PointPredicateID.SEVEN_PAIRS, 7, 7);

export const ALL_CHOWS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_CHOWS, onePairSubPredicate, atLeastFourChowsSubPredicate);

export const ALL_PONGS_AND_KONGS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_PONGS_AND_KONGS, onePairSubPredicate, atLeastFourPongsKongsSubPredicate);

export const ALL_KONGS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_KONGS, onePairSubPredicate, atLeastFourKongsSubPredicate);

export const SMALL_THREE_DRAGONS : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.SMALL_THREE_DRAGONS, dragonPairSubPredicate, twoDragonsPongKongSubPredicate);

export const SMALL_FOUR_WINDS : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.SMALL_FOUR_WINDS, windPairSubPredicate, threeWindsPongKongSubPredicate);