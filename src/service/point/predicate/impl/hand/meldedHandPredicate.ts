import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateConfiguration, PointPredicateOption } from "service/point/predicate/configuration/pointPredicateConfiguration";
import { WinContext } from "model/winContext/winContext";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { RoundContext } from "model/roundContext/roundContext";
import { notSelfDrawSubPredicate } from "service/point/predicate/impl/winCondition/winConditionSubPredicate";
import { onePairSubPredicate, lastTileCompletedPairSubPredicate, 
    ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate, 
    ifLastTileWasDiscardThenItCompletedPairSubPredicate } from "service/point/predicate/impl/hand/handSubPredicate";
import { createFilteredMeldsCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meld/meldPredicateFactoryBase";
import { meldIsPair } from "model/meld/pair";

const atLeastFourExposedNonPairMeldsSubPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_EXPOSED_NON_PAIR_MELDS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => meld.exposed);

export const MELDED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, roundContext: RoundContext, pointPredicateConfiguration: PointPredicateConfiguration) => {        
        if (pointPredicateConfiguration.getOptionValue(PointPredicateOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR)) {
            if (pointPredicateConfiguration.getOptionValue(PointPredicateOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
                return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                    atLeastFourExposedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                    onePairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                    lastTileCompletedPairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration));
            } else { // no restrictions on hand if last tile was a discard. the pair can be self drawn.
                // this is the most permissive option.
                return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                    atLeastFourExposedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                    onePairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                    ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration));
            }
        } else if (pointPredicateConfiguration.getOptionValue(PointPredicateOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
            // this is the most restrictive option, and is the same as the fully melded hand predicate.
            return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                atLeastFourExposedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                onePairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                notSelfDrawSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                ifLastTileWasDiscardThenItCompletedPairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration));
        } else { // no restrictions on hand if last tile was a discard
            return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                atLeastFourExposedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                onePairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                notSelfDrawSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration));
        }
    };

// four exposed non-pair melds, won by discard to finish the pair.
export const FULLY_MELDED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.FULLY_MELDED_HAND, atLeastFourExposedNonPairMeldsSubPredicate, 
        onePairSubPredicate, notSelfDrawSubPredicate, ifLastTileWasDiscardThenItCompletedPairSubPredicate);
