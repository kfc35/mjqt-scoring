import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate, predicateOr } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import WinContext from "model/winContext/winContext";
import { createPPResultBasedOnBooleanFlagWithTileDetail } from "service/point/predicate/impl/util/pointPredicateUtil";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";

export const SELF_DRAW_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SELF_DRAW, winningHand.isSelfDrawn(), 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const LAST_OF_ITS_KIND_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.LAST_OF_ITS_KIND, winContext.mostRecentTileIsLastOfItsKind, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const ROBBING_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.ROBBING_KONG, winContext.winByRobbingAKong, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const WIN_BY_LAST_TILE_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.WIN_BY_LAST_TILE, winContext.winByLastTileOnWall, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const WIN_BY_LAST_DISCARD_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.WIN_BY_LAST_DISCARD, winContext.winByLastDiscardOfGame, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const WIN_BY_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.WIN_BY_KONG, winContext.winByKongReplacement || winContext.winByKongOnKongReplacement,
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const WIN_BY_DOUBLE_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.WIN_BY_DOUBLE_KONG, winContext.winByKongOnKongReplacement, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const WIN_BY_FLOWER_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.WIN_BY_FLOWER, winContext.winByFlowerReplacement  || winContext.winByFlowerOnFlowerReplacement, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const WIN_BY_DOUBLE_FLOWER_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.WIN_BY_DOUBLE_FLOWER, winContext.winByFlowerOnFlowerReplacement, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const WIN_BY_MIXED_DOUBLE_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.WIN_BY_MIXED_DOUBLE_REPLACEMENT, winContext.winByMixedDoubleReplacement, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]]).build());
    }

export const winByAnyReplacementPredicate : PointPredicate<WinningHand> = 
    predicateOr(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT, WIN_BY_KONG_PREDICATE, WIN_BY_FLOWER_PREDICATE, WIN_BY_DOUBLE_KONG_PREDICATE, WIN_BY_DOUBLE_FLOWER_PREDICATE, WIN_BY_MIXED_DOUBLE_PREDICATE);

export const winByAnyDoubleReplacementPredicate : PointPredicate<WinningHand> = 
    predicateOr(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT, WIN_BY_DOUBLE_KONG_PREDICATE, WIN_BY_DOUBLE_FLOWER_PREDICATE, WIN_BY_MIXED_DOUBLE_PREDICATE);

export const WIN_WITH_INITIAL_HAND_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.WIN_WITH_INITIAL_HAND, winContext.winWithInitialHand, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([...winningHand.tiles.map(tileSublist => [...tileSublist])]).build());
    }