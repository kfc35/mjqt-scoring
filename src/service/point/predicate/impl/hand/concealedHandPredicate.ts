import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateConfiguration, PointPredicateOption } from "service/point/predicate/configuration/pointPredicateConfiguration";
import { createFilteredMeldsCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meld/meldPredicateFactoryBase";
import { meldIsPair } from "model/meld/pair";
import { meldIsKong } from "model/meld/kong";
import { meldIsPong } from "model/meld/pong";
import { WinContext } from "model/winContext/winContext";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { RoundContext } from "model/roundContext/roundContext";
import { SELF_DRAW_PREDICATE } from "service/point/predicate/impl/winCondition/winConditionPredicate";
import { onePairSubPredicate, ifLastTileWasDiscardThenItCompletedPairSubPredicate } from "service/point/predicate/impl/hand/handSubPredicate";

const atLeastFourConcealedPongsKongsSubPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CONCEALED_PONGS_AND_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => !meld.exposed && (meldIsKong(meld) || meldIsPong(meld)));
//const atLeastFourConcealedPongsSubPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CONCEALED_PONGS, 
    //meld => !meldIsPair(meld), melds => melds.length >= 4, meld => !meld.exposed && meldIsPong(meld));
const atLeastFourConcealedNonPairMeldsSubPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CONCEALED_NON_PAIR_MELDS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => !meld.exposed);
const atLeastFourConcealedMeldsSubPredicate : PointPredicate<StandardWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CONCEALED_MELDS, 
    (meld) => !meld.exposed, (melds) => melds.length >= 4, () => true);

export const SELF_TRIPLETS : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.SELF_TRIPLETS, onePairSubPredicate, atLeastFourConcealedPongsKongsSubPredicate);

export const CONCEALED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    (standardWinningHand: StandardWinningHand, winContext: WinContext, roundContext: RoundContext, pointPredicateConfiguration: PointPredicateConfiguration) => {
        if (pointPredicateConfiguration.getOptionValue(PointPredicateOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
            return PointPredicateResult.and(PointPredicateID.CONCEALED_HAND,
                atLeastFourConcealedNonPairMeldsSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                onePairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                ifLastTileWasDiscardThenItCompletedPairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration));
        } else { // last discarded tile can complete any meld
            return PointPredicateResult.and(PointPredicateID.CONCEALED_HAND,
                // pair can count as one of the concealed melds
                atLeastFourConcealedMeldsSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration),
                onePairSubPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration));
        }
    };

// four concealed non-pair melds, MUST win via self-draw
export const FULLY_CONCEALED_HAND_PREDICATE : PointPredicate<StandardWinningHand> = 
    predicateAnd(PointPredicateID.FULLY_CONCEALED_HAND,
            atLeastFourConcealedNonPairMeldsSubPredicate, onePairSubPredicate, SELF_DRAW_PREDICATE);
