import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meld/meldPredicateFactoryBase";
import Meld from "model/meld/meld";
import { meldIsPair } from "model/meld/pair";
import { meldIsKong } from "model/meld/kong";
import { meldIsPong } from "model/meld/pong";
import { createChowMinQuantityPredicate } from "service/point/predicate/factory/meld/chowPredicateFactory";
import { createKongMinQuantityPredicate } from "service/point/predicate/factory/meld/kongPredicateFactory";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { wrapSet } from "common/generic/setUtils";

export const atLeastFourChowsSubPredicate : PointPredicate<StandardWinningHand> = createChowMinQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CHOWS, 4);
export const atLeastFourKongsSubPredicate : PointPredicate<StandardWinningHand> = createKongMinQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_KONGS, 4);
export const atLeastFourPongsKongsSubPredicate : PointPredicate<StandardWinningHand> = createMeldCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_PONGS_AND_KONGS, meld => meldIsKong(meld) || meldIsPong(meld), 4);

export const ifLastTileWasDiscardThenItCompletedPairSubPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
        const winningMeld : Meld = standardWinningHand.meldWithWinningTile;
        if (!standardWinningHand.isSelfDrawn() && meldIsPair(winningMeld)) {
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR, true, [[[...winningMeld.tiles]]], [], wrapSet(new Set([standardWinningHand.meldWithWinningTileIndex])), []);
        } else if (standardWinningHand.isSelfDrawn()) { 
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR, true, [[[standardWinningHand.winningTile]]], [], new Set(), []);
        } else { // last tile was discard but winning meld is not a pair
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR, false, [], [[...winningMeld.tiles]], new Set(), []);
        }
    };

export const ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
        const winningMeld : Meld = standardWinningHand.meldWithWinningTile;
        if (standardWinningHand.isSelfDrawn() && meldIsPair(winningMeld) ) {
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR, true, [[[...winningMeld.tiles]]], [], wrapSet(new Set([standardWinningHand.meldWithWinningTileIndex])), []);
        } else if (!standardWinningHand.isSelfDrawn()) { // winning tile is not self drawn
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR, true, [[[standardWinningHand.winningTile]]], [], new Set(), []);
        } else { // last tile was self drawn but winning meld is not a pair
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR, false, [], [[...winningMeld.tiles]], new Set(), []);
        }
    };

export const lastTileCompletedPairSubPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
        const winningMeld: Meld = standardWinningHand.meldWithWinningTile;
        if (meldIsPair(winningMeld)) {
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_LAST_TILE_COMPLETED_PAIR, true, [[[...winningMeld.tiles]]], [], wrapSet(new Set([standardWinningHand.meldWithWinningTileIndex])), []);
        } else {
            return new PointPredicateResult(PointPredicateID.SUBPREDICATE_LAST_TILE_COMPLETED_PAIR, false, [], [[...winningMeld.tiles]], new Set(), []);
    }
};