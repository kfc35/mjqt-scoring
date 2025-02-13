import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import WinContext from "model/winContext/winContext";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import { RoundContext } from "model/roundContext/roundContext";
import { notSelfDrawSubPredicate } from "service/point/predicate/impl/winCondition/winConditionSubPredicate";
import { lastTileCompletedPairSubPredicate, 
    ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate, 
    ifLastTileWasDiscardThenItCompletedPairSubPredicate } from "service/point/predicate/impl/hand/handSubPredicate";
import { createFilteredMeldsCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meld/meldPredicateFactoryBase";
import { meldIsPair } from "model/meld/pair";
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "service/point/predicate/configuration/logic/pointPredicateLogicConfiguration";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";

const atLeastFourExposedNonPairMeldsSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_EXPOSED_NON_PAIR_MELDS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => meld.exposed);

export const MELDED_HAND_PREDICATE : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand, winContext: WinContext, roundContext: RoundContext, config: RootPointPredicateConfiguration) => {   
        const logicConfig = config.getLogicConfiguration();
        if (logicConfig.getOptionValue(PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR)) {
            if (logicConfig.getOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
                return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                    atLeastFourExposedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, config),
                    onePairSubPredicate(standardWinningHand, winContext, roundContext, config),
                    lastTileCompletedPairSubPredicate(standardWinningHand, winContext, roundContext, config));
            } else { // no restrictions on hand if last tile was a discard. the pair can be self drawn.
                // this is the most permissive option.
                return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                    atLeastFourExposedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, config),
                    onePairSubPredicate(standardWinningHand, winContext, roundContext, config),
                    ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate(standardWinningHand, winContext, roundContext, config));
            }
        } else if (logicConfig.getOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
            // this is the most restrictive option, and is the same as the fully melded hand predicate.
            return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                atLeastFourExposedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, config),
                onePairSubPredicate(standardWinningHand, winContext, roundContext, config),
                notSelfDrawSubPredicate(standardWinningHand, winContext, roundContext, config),
                ifLastTileWasDiscardThenItCompletedPairSubPredicate(standardWinningHand, winContext, roundContext, config));
        } else { // no restrictions on hand if last tile was a discard
            return PointPredicateResult.and(PointPredicateID.MELDED_HAND,
                atLeastFourExposedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, config),
                onePairSubPredicate(standardWinningHand, winContext, roundContext, config),
                notSelfDrawSubPredicate(standardWinningHand, winContext, roundContext, config));
        }
    };

// four exposed non-pair melds, won by discard to finish the pair.
export const FULLY_MELDED_HAND_PREDICATE : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.FULLY_MELDED_HAND, atLeastFourExposedNonPairMeldsSubPredicate, 
        onePairSubPredicate, notSelfDrawSubPredicate, ifLastTileWasDiscardThenItCompletedPairSubPredicate);
