import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { createPairQuantityPredicate } from "service/point/predicate/factory/pairPredicateFactory";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateConfiguration, PointPredicateOption } from "service/point/predicate/configuration/pointPredicateConfiguration";
import { createFilteredMeldsCheckerSuccessesQuantityPredicate, createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldPredicateFactoryBase";
import Meld from "model/meld/meld";
import { meldIsPair } from "model/meld/pair";
import { meldIsKong } from "model/meld/kong";
import { meldIsPong } from "model/meld/pong";
import { createChowMinQuantityPredicate } from "service/point/predicate/factory/chowPredicateFactory";
import { createKongMinQuantityPredicate } from "service/point/predicate/factory/kongPredicateFactory";
import { WinContext } from "model/winContext/winContext";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { wrapSet } from "common/generic/setUtils";

const onePairPredicate : PointPredicate<StandardWinningHand> = createPairQuantityPredicate(PointPredicateID.ONE_PAIR, 1, 1);
const atLeastFourChowsPredicate : PointPredicate<StandardWinningHand> = createChowMinQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_CHOWS, 4);
const atLeastFourKongsPredicate : PointPredicate<StandardWinningHand> = createKongMinQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_KONGS, 4);
const atLeastFourPongsKongsPredicate : PointPredicate<StandardWinningHand> = createMeldCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_PONGS_AND_KONGS, meld => meldIsKong(meld) || meldIsPong(meld), 4);
const atLeastFourConcealedPongsKongsPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_CONCEALED_PONGS_AND_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => !meld.exposed && (meldIsKong(meld) || meldIsPong(meld)));
const atLeastFourConcealedNonPairMeldsPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_CONCEALED_NON_PAIR_MELDS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => !meld.exposed);
const ifLastTileWasDiscardThenItCompletedPairPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
        const winningMeld : Meld = standardWinningHand.meldWithWinningTile;
        if (!standardWinningHand.isSelfDrawn() && meldIsPair(winningMeld)) {
            return new PointPredicateResult(PointPredicateID.IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR, true, [[[...winningMeld.tiles]]], [], wrapSet(new Set([standardWinningHand.meldWithWinningTileIndex])), []);
        } else if (standardWinningHand.isSelfDrawn()) { 
            return new PointPredicateResult(PointPredicateID.IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR, true, [[[standardWinningHand.winningTile]]], [], new Set(), []);
        } else { // last tile was discard but winning meld is not a pair
            return new PointPredicateResult(PointPredicateID.IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR, false, [], [[...winningMeld.tiles]], new Set(), []);
        }
    };

const ifLastTileWasSelfDrawnThenItCompletedPairPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
        const winningMeld : Meld = standardWinningHand.meldWithWinningTile;
        if (standardWinningHand.isSelfDrawn() && meldIsPair(winningMeld) ) {
            return new PointPredicateResult(PointPredicateID.IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR, true, [[[...winningMeld.tiles]]], [], wrapSet(new Set([standardWinningHand.meldWithWinningTileIndex])), []);
        } else if (!standardWinningHand.isSelfDrawn()) { // winning tile is not self drawn
            return new PointPredicateResult(PointPredicateID.IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR, true, [[[standardWinningHand.winningTile]]], [], new Set(), []);
        } else { // last tile was self drawn but winning meld is not a pair
            return new PointPredicateResult(PointPredicateID.IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR, false, [], [[...winningMeld.tiles]], new Set(), []);
        }
    };

const lastTileCompletedPairPredicate : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
        if (meldIsPair(standardWinningHand.meldWithWinningTile)) {
            return new PointPredicateResult(PointPredicateID.LAST_TILE_COMPLETED_PAIR, true, [[[...standardWinningHand.meldWithWinningTile.tiles]]], [], wrapSet(new Set([standardWinningHand.meldWithWinningTileIndex])), []);
        } else {
            const meld: Meld = standardWinningHand.meldWithWinningTile;
            return new PointPredicateResult(PointPredicateID.LAST_TILE_COMPLETED_PAIR, false, [], [[...meld.tiles]], new Set(), []);
    }
};

const atLeastFourConcealedMeldsPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_CONCEALED_MELDS, 
    (meld) => !meld.exposed, (melds) => melds.length >= 4, () => true);
const atLeastFourExposedNonPairMeldsPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.AT_LEAST_FOUR_EXPOSED_NON_PAIR_MELDS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => meld.exposed);

export const SELF_DRAW_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
        if (standardWinningHand.isSelfDrawn()) {
            return new PointPredicateResult(PointPredicateID.SELF_DRAW, true, [[[standardWinningHand.winningTile]]], [], new Set(), []);
        }
        return new PointPredicateResult(PointPredicateID.SELF_DRAW, false, [], [[standardWinningHand.winningTile]], new Set(), []);
    }

export const NOT_SELF_DRAW_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand) => {
        if (!standardWinningHand.isSelfDrawn()) {
            return new PointPredicateResult(PointPredicateID.NOT_SELF_DRAW, true, [[[standardWinningHand.winningTile]]], [], new Set(), []);
        }
        return new PointPredicateResult(PointPredicateID.NOT_SELF_DRAW, false, [], [[standardWinningHand.winningTile]], new Set(), []);
    }

export const SEVEN_PAIRS_PREDICATE : PointPredicate<StandardWinningHand> = createPairQuantityPredicate(PointPredicateID.SEVEN_PAIRS, 7, 7);

export const ALL_CHOWS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_CHOWS, onePairPredicate, atLeastFourChowsPredicate);

export const ALL_PONGS_AND_KONGS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_PONGS_AND_KONGS, onePairPredicate, atLeastFourPongsKongsPredicate);

export const ALL_KONGS_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.ALL_KONGS, onePairPredicate, atLeastFourKongsPredicate);

export const SELF_TRIPLETS : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.SELF_TRIPLETS, onePairPredicate, atLeastFourConcealedPongsKongsPredicate);

export const CONCEALED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, pointPredicateConfiguration: PointPredicateConfiguration) => {
        if (pointPredicateConfiguration.getOptionValue(PointPredicateOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
            return PointPredicateResult.and(PointPredicateID.CONCEALED_HAND,
                atLeastFourConcealedNonPairMeldsPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                onePairPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                ifLastTileWasSelfDrawnThenItCompletedPairPredicate(standardWinningHand, winContext, pointPredicateConfiguration));
        } else { // last discarded tile can complete any meld 
            return PointPredicateResult.and(PointPredicateID.CONCEALED_HAND,
                // pair can count as one of the concealed melds
                atLeastFourConcealedMeldsPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                onePairPredicate(standardWinningHand, winContext, pointPredicateConfiguration));
        }
    };

// four concealed non-pair melds, self-draw to complete the pair
export const FULLY_CONCEALED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.FULLY_CONCEALED_HAND,
            atLeastFourConcealedNonPairMeldsPredicate, onePairPredicate, 
            SELF_DRAW_PREDICATE, ifLastTileWasSelfDrawnThenItCompletedPairPredicate);

export const MELDED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, pointPredicateConfiguration: PointPredicateConfiguration) => {        
        if (pointPredicateConfiguration.getOptionValue(PointPredicateOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR)) {
            if (pointPredicateConfiguration.getOptionValue(PointPredicateOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
                return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                    atLeastFourExposedNonPairMeldsPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                    onePairPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                    lastTileCompletedPairPredicate(standardWinningHand, winContext, pointPredicateConfiguration));
            } else { // no restrictions on hand if last tile was a discard. the pair can be self drawn.
                // this is the most permissive option.
                return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                    atLeastFourExposedNonPairMeldsPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                    onePairPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                    ifLastTileWasSelfDrawnThenItCompletedPairPredicate(standardWinningHand, winContext, pointPredicateConfiguration));
            }
        } else if (pointPredicateConfiguration.getOptionValue(PointPredicateOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
            // this is the most restrictive option, and is the same as the fully melded hand predicate.
            return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                atLeastFourExposedNonPairMeldsPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                onePairPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                NOT_SELF_DRAW_PREDICATE(standardWinningHand, winContext, pointPredicateConfiguration),
                ifLastTileWasDiscardThenItCompletedPairPredicate(standardWinningHand, winContext, pointPredicateConfiguration));
        } else { // no restrictions on hand if last tile was a discard
            return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                atLeastFourExposedNonPairMeldsPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                onePairPredicate(standardWinningHand, winContext, pointPredicateConfiguration),
                NOT_SELF_DRAW_PREDICATE(standardWinningHand, winContext, pointPredicateConfiguration));
        }
    };

// four exposed non-pair melds, won by discard to finish the pair.
export const FULLY_MELDED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.FULLY_MELDED_HAND, atLeastFourExposedNonPairMeldsPredicate, 
        onePairPredicate, NOT_SELF_DRAW_PREDICATE, ifLastTileWasDiscardThenItCompletedPairPredicate);