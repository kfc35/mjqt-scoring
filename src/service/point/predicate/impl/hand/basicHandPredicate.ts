import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { createPairQuantityPredicate } from "service/point/predicate/factory/meldBased/pairPredicateFactory";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { dragonPairSubPredicate, windPairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { twoDragonsPongKongSubPredicate, threeWindsPongKongSubPredicate } from "service/point/predicate/impl/meld/honorsPongKongSubPredicates";
import { atLeastFourChowsSubPredicate, atLeastFourKongsSubPredicate, atLeastFourPongsKongsSubPredicate } from "service/point/predicate/impl/hand/lastTileSubPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "../util/pointPredicateUtil";

const sevenPairsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = createPairQuantityPredicate(PointPredicateID.SEVEN_PAIRS, 7, 7);
export const SEVEN_PAIRS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.SEVEN_PAIRS, sevenPairsMeldBasedPredicate);

const allChowsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_CHOWS, onePairSubPredicate, atLeastFourChowsSubPredicate);
export const ALL_CHOWS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.ALL_CHOWS, allChowsMeldBasedPredicate);

const allPongsKongsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_PONGS_AND_KONGS, onePairSubPredicate, atLeastFourPongsKongsSubPredicate);
export const ALL_PONGS_AND_KONGS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.ALL_PONGS_AND_KONGS, allPongsKongsMeldBasedPredicate);

const allKongsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_KONGS, onePairSubPredicate, atLeastFourKongsSubPredicate);
export const ALL_KONGS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.ALL_KONGS, allKongsMeldBasedPredicate);

const smallThreeDragonsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.SMALL_THREE_DRAGONS, dragonPairSubPredicate, twoDragonsPongKongSubPredicate);
export const SMALL_THREE_DRAGONS : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.SMALL_THREE_DRAGONS, smallThreeDragonsMeldBasedPredicate);

const smallFourWindsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
predicateAnd(PointPredicateID.SMALL_FOUR_WINDS, windPairSubPredicate, threeWindsPongKongSubPredicate);
export const SMALL_FOUR_WINDS : PointPredicate<MeldBasedWinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.SMALL_FOUR_WINDS, smallFourWindsMeldBasedPredicate);