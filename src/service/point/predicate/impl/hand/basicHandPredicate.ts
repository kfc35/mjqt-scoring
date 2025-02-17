import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { createPairQuantityPredicate } from "service/point/predicate/factory/meldBased/pairPredicateFactory";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { dragonPairSubPredicate, windPairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { twoDragonsPongKongSubPredicate, threeWindsPongKongSubPredicate } from "service/point/predicate/impl/meld/honorsPongKongSubPredicates";
import { atLeastFourChowsSubPredicate, atLeastFourKongsSubPredicate, atLeastFourPongsKongsSubPredicate } from "service/point/predicate/impl/hand/lastTileSubPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateSwitcher } from "../util/pointPredicateUtil";

const sevenPairsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = createPairQuantityPredicate(PointPredicateID.SEVEN_PAIRS, 7, 7);

const sevenPairsSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.SEVEN_PAIRS).build();

export const SEVEN_PAIRS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateSwitcher(sevenPairsMeldBasedPredicate, sevenPairsSpecialPredicate);


const allChowsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_CHOWS, onePairSubPredicate, atLeastFourChowsSubPredicate);

const allChowsSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.ALL_CHOWS).build();

export const ALL_CHOWS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateSwitcher(allChowsMeldBasedPredicate, allChowsSpecialPredicate);


const allPongsKongsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_PONGS_AND_KONGS, onePairSubPredicate, atLeastFourPongsKongsSubPredicate);

const allPongsKongsSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.ALL_PONGS_AND_KONGS).build();

export const ALL_PONGS_AND_KONGS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateSwitcher(allPongsKongsMeldBasedPredicate, allPongsKongsSpecialPredicate);


const allKongsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_KONGS, onePairSubPredicate, atLeastFourKongsSubPredicate);

const allKongsSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.ALL_KONGS).build();

export const ALL_KONGS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateSwitcher(allKongsMeldBasedPredicate, allKongsSpecialPredicate);


const smallThreeDragonsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.SMALL_THREE_DRAGONS, dragonPairSubPredicate, twoDragonsPongKongSubPredicate);

const smallThreeDragonsSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.SMALL_THREE_DRAGONS).build();

export const SMALL_THREE_DRAGONS : PointPredicate<WinningHand> = createPointPredicateSwitcher(smallThreeDragonsMeldBasedPredicate, smallThreeDragonsSpecialPredicate);


const smallFourWindsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
predicateAnd(PointPredicateID.SMALL_FOUR_WINDS, windPairSubPredicate, threeWindsPongKongSubPredicate);

const smallFourWindsSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.SMALL_FOUR_WINDS).build();

export const SMALL_FOUR_WINDS : PointPredicate<MeldBasedWinningHand> = createPointPredicateSwitcher(smallFourWindsMeldBasedPredicate, smallFourWindsSpecialPredicate);