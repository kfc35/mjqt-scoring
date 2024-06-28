import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { ALL_PONGS_AND_KONGS_PREDICATE } from "service/point/predicate/impl/hand/basicHandPredicate";
import { GREEN_DRAGON_PONG_KONG_PREDICATE, RED_DRAGON_PONG_KONG_PREDICATE, WHITE_DRAGON_PONG_KONG_PREDICATE } from "service/point/predicate/impl/meld/dragonPongPredicate";
import { allGivenSuitAndGivenDragonPredicate } from "service/point/predicate/impl/tileGroupAndValuePredicate";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue } from "model/tile/tileValue";

const allBambooAndGreenDragonSubPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON, standardWinningHand, 
            TileGroup.BAMBOO, DragonTileValue.GREEN);
    };

export const JADE_DRAGON_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allBambooAndGreenDragonSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        GREEN_DRAGON_PONG_KONG_PREDICATE);

const allCharacterAndRedDragonSubPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON, standardWinningHand, 
            TileGroup.CHARACTER, DragonTileValue.RED);
    };

export const RUBY_DRAGON_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allCharacterAndRedDragonSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        RED_DRAGON_PONG_KONG_PREDICATE);

const allCircleAndWhiteDragonSubPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand : StandardWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON, standardWinningHand, 
            TileGroup.CIRCLE, DragonTileValue.WHITE);
    };

export const PEARL_DRAGON_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allCircleAndWhiteDragonSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        WHITE_DRAGON_PONG_KONG_PREDICATE);
