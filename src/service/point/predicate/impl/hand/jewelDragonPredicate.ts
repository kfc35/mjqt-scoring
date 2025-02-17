import { createPointPredicateSwitcher, PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { ALL_PONGS_AND_KONGS_PREDICATE } from "service/point/predicate/impl/hand/basicHandPredicate";
import { GREEN_DRAGON_PONG_KONG_PREDICATE, RED_DRAGON_PONG_KONG_PREDICATE, WHITE_DRAGON_PONG_KONG_PREDICATE } from "service/point/predicate/impl/meld/dragonPongPredicate";
import { allGivenSuitAndGivenDragonPredicate } from "service/point/predicate/impl/tileGroupAndValuePredicate";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue } from "model/tile/tileValue";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";

const allBambooAndGreenDragonSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON, standardWinningHand, 
            TileGroup.BAMBOO, DragonTileValue.GREEN);
    };

const jadeDragonMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allBambooAndGreenDragonSubPredicate,
        onePairSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        GREEN_DRAGON_PONG_KONG_PREDICATE);
const jadeDragonSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.JADE_DRAGON).build();
export const JADE_DRAGON_PREDICATE : PointPredicate<WinningHand> = createPointPredicateSwitcher(jadeDragonMeldBasedPredicate, jadeDragonSpecialPredicate);

const allCharacterAndRedDragonSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON, standardWinningHand, 
            TileGroup.CHARACTER, DragonTileValue.RED);
    };

const rubyDragonMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allCharacterAndRedDragonSubPredicate, 
        onePairSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        RED_DRAGON_PONG_KONG_PREDICATE);
const rubyDragonSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.RUBY_DRAGON).build();
export const RUBY_DRAGON_PREDICATE : PointPredicate<WinningHand> = createPointPredicateSwitcher(rubyDragonMeldBasedPredicate, rubyDragonSpecialPredicate);

const allCircleAndWhiteDragonSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON, standardWinningHand, 
            TileGroup.CIRCLE, DragonTileValue.WHITE);
    };

const pearlDragonMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allCircleAndWhiteDragonSubPredicate, 
        onePairSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        WHITE_DRAGON_PONG_KONG_PREDICATE);
const pearlDragonSpecialPredicate : PointPredicate<SpecialWinningHand> = () => 
    new PointPredicateFailureResult.Builder().pointPredicateId(PointPredicateID.PEARL_DRAGON).build();
export const PEARL_DRAGON_PREDICATE : PointPredicate<WinningHand> = createPointPredicateSwitcher(pearlDragonMeldBasedPredicate, pearlDragonSpecialPredicate);