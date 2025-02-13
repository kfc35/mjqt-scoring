import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "service/point/predicate/configuration/logic/pointPredicateLogicConfiguration";
import { createFilteredMeldsCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meld/meldPredicateFactoryBase";
import { meldIsPair } from "model/meld/pair";
import { meldIsKong } from "model/meld/kong";
import { meldIsPong } from "model/meld/pong";
import WinContext from "model/winContext/winContext";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import { RoundContext } from "model/roundContext/roundContext";
import { SELF_DRAW_PREDICATE } from "service/point/predicate/impl/winCondition/winConditionPredicate";
import { ifLastTileWasDiscardThenItCompletedPairSubPredicate } from "service/point/predicate/impl/hand/handSubPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";

const atLeastFourConcealedPongsKongsSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CONCEALED_PONGS_AND_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => !meld.exposed && (meldIsKong(meld) || meldIsPong(meld)));
const atLeastFourConcealedPongsSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CONCEALED_PONGS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => !meld.exposed && meldIsPong(meld));
const atLeastFourConcealedNonPairMeldsSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CONCEALED_NON_PAIR_MELDS, 
    meld => !meldIsPair(meld), melds => melds.length >= 4, meld => !meld.exposed);
export const atLeastFourConcealedMeldsSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CONCEALED_MELDS, 
    (meld) => !meld.exposed, (melds) => melds.length >= 4, () => true);

export const SELF_TRIPLETS : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand, winCtx: WinContext, roundCtx: RoundContext, config: RootPointPredicateConfiguration) => {
        if (config.getLogicConfiguration().getOptionValue(PointPredicateLogicOption.SELF_TRIPLETS_ONLY_PONGS_ALLOWED)) {
            return PointPredicateResult.and(PointPredicateID.SELF_TRIPLETS,
                onePairSubPredicate(standardWinningHand, winCtx, roundCtx, config),
                atLeastFourConcealedPongsSubPredicate(standardWinningHand, winCtx, roundCtx, config));
        } else {
            return PointPredicateResult.and(PointPredicateID.SELF_TRIPLETS,
                onePairSubPredicate(standardWinningHand, winCtx, roundCtx, config),
                atLeastFourConcealedPongsKongsSubPredicate(standardWinningHand, winCtx, roundCtx, config));
        }
    };

export const CONCEALED_HAND_PREDICATE : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand, winCtx: WinContext, roundCtx: RoundContext, config: RootPointPredicateConfiguration) => {
        if (config.getLogicConfiguration().getOptionValue(PointPredicateLogicOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
            return PointPredicateResult.and(PointPredicateID.CONCEALED_HAND,
                atLeastFourConcealedNonPairMeldsSubPredicate(standardWinningHand, winCtx, roundCtx, config),
                onePairSubPredicate(standardWinningHand, winCtx, roundCtx, config),
                ifLastTileWasDiscardThenItCompletedPairSubPredicate(standardWinningHand, winCtx, roundCtx, config));
        } else { // last discarded tile can complete any meld
            return PointPredicateResult.and(PointPredicateID.CONCEALED_HAND,
                // pair can count as one of the concealed melds
                atLeastFourConcealedMeldsSubPredicate(standardWinningHand, winCtx, roundCtx, config),
                onePairSubPredicate(standardWinningHand, winCtx, roundCtx, config));
        }
    };

// four concealed non-pair melds, MUST win via self-draw
export const FULLY_CONCEALED_HAND_PREDICATE : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.FULLY_CONCEALED_HAND,
            atLeastFourConcealedNonPairMeldsSubPredicate, onePairSubPredicate, SELF_DRAW_PREDICATE);
