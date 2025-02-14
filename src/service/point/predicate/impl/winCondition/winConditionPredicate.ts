import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate, predicateOr } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import WinContext from "model/winContext/winContext";
import { createPointPredicateResultBasedOnBooleanFlag } from "service/point/predicate/impl/util/pointPredicateUtil";

export const SELF_DRAW_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.SELF_DRAW, winningHand.isSelfDrawn(), [[winningHand.winningTile]]);
    }

export const LAST_OF_ITS_KIND_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.LAST_OF_ITS_KIND, winContext.mostRecentTileIsLastOfItsKind, [[winningHand.winningTile]]);
    }

export const ROBBING_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.ROBBING_KONG, winContext.winByRobbingAKong, [[winningHand.winningTile]]);
    }

export const WIN_BY_LAST_TILE_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.WIN_BY_LAST_TILE, winContext.winByLastTileOnWall, [[winningHand.winningTile]]);
    }

export const WIN_BY_LAST_DISCARD_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.WIN_BY_LAST_DISCARD, winContext.winByLastDiscardOfGame, [[winningHand.winningTile]]);
    }

export const WIN_BY_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.WIN_BY_KONG, winContext.winByKongReplacement || winContext.winByKongOnKongReplacement, [[winningHand.winningTile]]);
    }

export const WIN_BY_DOUBLE_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.WIN_BY_DOUBLE_KONG, winContext.winByKongOnKongReplacement, [[winningHand.winningTile]]);
    }

export const WIN_BY_FLOWER_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.WIN_BY_FLOWER, winContext.winByFlowerReplacement  || winContext.winByFlowerOnFlowerReplacement, [[winningHand.winningTile]]);
    }

export const WIN_BY_DOUBLE_FLOWER_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.WIN_BY_DOUBLE_FLOWER, winContext.winByFlowerOnFlowerReplacement, [[winningHand.winningTile]]);
    }

export const WIN_BY_MIXED_DOUBLE_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.WIN_BY_MIXED_DOUBLE_REPLACEMENT, winContext.winByMixedDoubleReplacement, [[winningHand.winningTile]]);
    }

export const winByAnyReplacementPredicate : PointPredicate<WinningHand> = 
    predicateOr(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT, WIN_BY_KONG_PREDICATE, WIN_BY_FLOWER_PREDICATE, WIN_BY_DOUBLE_KONG_PREDICATE, WIN_BY_DOUBLE_FLOWER_PREDICATE, WIN_BY_MIXED_DOUBLE_PREDICATE);

export const winByAnyDoubleReplacementPredicate : PointPredicate<WinningHand> = 
    predicateOr(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT, WIN_BY_DOUBLE_KONG_PREDICATE, WIN_BY_DOUBLE_FLOWER_PREDICATE, WIN_BY_MIXED_DOUBLE_PREDICATE);

export const WIN_WITH_INITIAL_HAND_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.WIN_WITH_INITIAL_HAND, winContext.winWithInitialHand, winningHand.tiles);
    }