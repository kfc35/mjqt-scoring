import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { notSelfDrawSubPredicate } from "service/point/predicate/impl/winCondition/basicWinConditionSubPredicate";
import { lastTileCompletedPairSubPredicate, ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate,
    ifLastTileWasDiscardThenItCompletedPairSubPredicate } from "service/point/predicate/impl/hand/lastTileSubPredicate";
import { createMeldCheckerSuccessesQuantityPredicate, createFilteredMeldsCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";
import { meldIsPair } from "model/meld/pair";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "service/point/predicate/impl/util/pointPredicateUtil";

const everyMeldIsExposedSubPredicate : PointPredicate<MeldBasedWinningHand> = createMeldCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_EXPOSED, 
    meld => meld.exposed);
const allNonPairMeldsAreExposedSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_ALL_NON_PAIR_MELDS_ARE_EXPOSED, 
    meld => !meldIsPair(meld), () => true, (meld) => meld.exposed);

const meldedHandMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand: MeldBasedWinningHand, winContext: WinContext, roundContext: RoundContext, config: RootPointPredicateConfiguration) => {   
        const logicConfig = config.pointPredicateLogicConfiguration;
        if (logicConfig.getOptionValue(PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR)) {
            if (logicConfig.getOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
                return predicateAnd(PointPredicateID.MELDED_HAND,
                    allNonPairMeldsAreExposedSubPredicate,
                    onePairSubPredicate,
                    // the last tile must complete the pair, no matter if it is self draw or discard
                    lastTileCompletedPairSubPredicate)(meldBasedWinningHand, winContext, roundContext, config);
            } else { // no restrictions on hand if last tile was a discard. the pair can be self drawn.
                // this is the most permissive option.
                return predicateAnd(PointPredicateID.MELDED_HAND,
                    allNonPairMeldsAreExposedSubPredicate,
                    onePairSubPredicate, 
                    ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate)(meldBasedWinningHand, winContext, roundContext, config);
                    // if the last tile was discard, it can have been used to complete either the pair or the last exposed meld
            }
        } else if (logicConfig.getOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
            // this is the most restrictive option, and is logically the same as the fully melded hand predicate.
            return predicateAnd(PointPredicateID.MELDED_HAND,
                allNonPairMeldsAreExposedSubPredicate,
                onePairSubPredicate,
                notSelfDrawSubPredicate,
                ifLastTileWasDiscardThenItCompletedPairSubPredicate)(meldBasedWinningHand, winContext, roundContext, config);
        } else { // no restrictions on hand if last tile was a discard
            return predicateAnd(PointPredicateID.MELDED_HAND,
                allNonPairMeldsAreExposedSubPredicate,
                onePairSubPredicate,
                notSelfDrawSubPredicate)(meldBasedWinningHand, winContext, roundContext, config);
                // the last tile (a discard) can be used to complete either the pair or the fourth exposed meld.
                // (the pair can stay concealed if the last tile completes a fourth exposed meld)
        }
    };

// every meld is exposed, and the hand was won by discard to finish the pair.
const fullyMeldedHandMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.FULLY_MELDED_HAND, everyMeldIsExposedSubPredicate, onePairSubPredicate,
        notSelfDrawSubPredicate, ifLastTileWasDiscardThenItCompletedPairSubPredicate);

export const MELDED_HAND_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.MELDED_HAND, meldedHandMeldBasedPredicate);
export const FULLY_MELDED_HAND_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.FULLY_MELDED_HAND, fullyMeldedHandMeldBasedPredicate);