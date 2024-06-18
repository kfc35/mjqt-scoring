import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { WinContext } from "model/winContext/winContext";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { toTiles } from "common/meldUtils";

function evaluateWinConditionPredicate(pointPredicateId: PointPredicateID, flag: boolean, tiles: SuitedOrHonorTile[][]): PointPredicateResult {
    if (flag) {
        return new PointPredicateResult(pointPredicateId, flag, [tiles], [], new Set(), []);
    }
    return new PointPredicateResult(pointPredicateId, flag, [], tiles, new Set(), []);
}

export const SELF_DRAW_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        return evaluateWinConditionPredicate(PointPredicateID.SELF_DRAW, winningHand.isSelfDrawn(), [[winningHand.winningTile]]);
    }

export const notSelfDrawSubPredicate : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        return evaluateWinConditionPredicate(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW, !winningHand.isSelfDrawn(), [[winningHand.winningTile]]);
    }

export const LAST_OF_ITS_KIND_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.LAST_OF_ITS_KIND, winContext.mostRecentTileIsLastOfItsKind, [[winningHand.winningTile]]);
    }

export const ROBBING_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.ROBBING_KONG, winContext.winByRobbingAKong, [[winningHand.winningTile]]);
    }

export const WIN_BY_LAST_TILE_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.WIN_BY_LAST_TILE, winContext.winByLastTileOnWall, [[winningHand.winningTile]]);
    }

export const WIN_BY_LAST_DISCARD_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.WIN_BY_LAST_DISCARD, winContext.winByLastDiscardOfGame, [[winningHand.winningTile]]);
    }

export const WIN_BY_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.WIN_BY_KONG, winContext.winByKongReplacement, [[winningHand.winningTile]]);
    }

export const WIN_BY_DOUBLE_KONG_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.WIN_BY_DOUBLE_KONG, winContext.winByKongOnKongReplacement, [[winningHand.winningTile]]);
    }

export const WIN_BY_FLOWER_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.WIN_BY_FLOWER, winContext.winByFlowerReplacement, [[winningHand.winningTile]]);
    }

export const WIN_BY_DOUBLE_FLOWER_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.WIN_BY_DOUBLE_FLOWER, winContext.winByFlowerOnFlowerReplacement, [[winningHand.winningTile]]);
    }

export const WIN_WITH_INITIAL_HAND_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, winContext: WinContext) => {
        return evaluateWinConditionPredicate(PointPredicateID.WIN_WITH_INITIAL_HAND, winContext.winWithInitialHand, toTiles(winningHand.getMelds()));
    }