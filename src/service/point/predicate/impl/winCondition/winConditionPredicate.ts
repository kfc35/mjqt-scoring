import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate, predicateAnd, predicateOr } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import WinContext from "model/winContext/winContext";
import { createPPResultBasedOnBooleanFlagWithTileDetail } from "service/point/predicate/impl/util/pointPredicateUtil";
import PointPredicateSuccessResultTileDetail from "service/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResultTileDetail from "service/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";

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

const winWithInitialHandSubPredicate : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND, winContext.winWithInitialHand, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([...winningHand.tiles.map(tileSublist => [...tileSublist])]).build());
    }

const seatWindIsEastSubPredicate : PointPredicate<WinningHand> = 
    (_winningHand: WinningHand, _winContext: WinContext, roundContext: RoundContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST, roundContext.seatWind === WindDirection.EAST);
}

const seatWindIsNotEastSubPredicate : PointPredicate<WinningHand> = 
    (_winningHand: WinningHand, _winContext: WinContext, roundContext: RoundContext) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST, roundContext.seatWind !== WindDirection.EAST);
}

export const EARTHLY_HAND_PREDICATE : PointPredicate<WinningHand> = 
    predicateAnd(PointPredicateID.EARTHLY_HAND, winWithInitialHandSubPredicate, seatWindIsEastSubPredicate);

export const HEAVENLY_HAND_PREDICATE : PointPredicate<WinningHand> = 
    predicateAnd(PointPredicateID.HEAVENLY_HAND, winWithInitialHandSubPredicate, seatWindIsNotEastSubPredicate);