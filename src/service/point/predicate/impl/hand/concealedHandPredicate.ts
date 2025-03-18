import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { createPointPredicateRouter, createPointPredicateRouterWithAutoFailSpecialPredicate, createPointPredicateRouterWithAutoSuccessSpecialPredicate, createPPResultBasedOnBooleanFlagWithTileDetail} from "service/point/predicate/impl/util/pointPredicateUtil";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";
import { createFilteredMeldsCheckerPredicate, createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";
import { meldIsPair } from "model/meld/pair";
import { meldIsKong } from "model/meld/kong";
import { meldIsPong } from "model/meld/pong";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { SELF_DRAW_PREDICATE } from "service/point/predicate/impl/winCondition/basicWinConditionPredicate";
import { ifLastTileWasDiscardThenItCompletedPairSubPredicate, ifThereIsOnlyOneExposedMeldThenItIsMeldWithLastTileSubPredicate } from "service/point/predicate/impl/hand/lastTileSubPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { PointPredicateFailureResultTileDetail } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { PointPredicateSuccessResultTileDetail } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";

const containsFourConcealedPongsKongsSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS_AND_KONGS, 
    meld => !meldIsPair(meld), melds => melds.length === 4, meld => !meld.exposed && (meldIsKong(meld) || meldIsPong(meld)));
const containsFourConcealedPongsSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS, 
    meld => !meldIsPair(meld), melds => melds.length === 4, meld => !meld.exposed && meldIsPong(meld));
const everyMeldIsConcealedSubPredicate : PointPredicate<MeldBasedWinningHand> = createMeldCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_CONCEALED, 
    meld => !meld.exposed);
export const atLeastNumMeldsMinusOneAreConcealedSubPredicate : PointPredicate<MeldBasedWinningHand> = createFilteredMeldsCheckerPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED, 
    meld => !meld.exposed, (melds, winningHand) => melds.length >= winningHand.melds.length - 1, () => true);

const selfTripletsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand: MeldBasedWinningHand, winCtx: WinContext, roundCtx: RoundContext, config: RootPointPredicateConfiguration) => {
        if (config.pointPredicateLogicConfiguration.getOptionValue(PointPredicateLogicOption.SELF_TRIPLETS_ONLY_PONGS_ALLOWED)) {
            return predicateAnd(PointPredicateID.SELF_TRIPLETS,
                onePairSubPredicate,
                containsFourConcealedPongsSubPredicate)(meldBasedWinningHand, winCtx, roundCtx, config);
        } else {
            return predicateAnd(PointPredicateID.SELF_TRIPLETS,
                onePairSubPredicate,
                containsFourConcealedPongsKongsSubPredicate)(meldBasedWinningHand, winCtx, roundCtx, config);
        }
    };

const concealedHandMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand: MeldBasedWinningHand, winCtx: WinContext, roundCtx: RoundContext, config: RootPointPredicateConfiguration) => {
        if (config.pointPredicateLogicConfiguration.getOptionValue(PointPredicateLogicOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR)) {
            return predicateAnd(PointPredicateID.CONCEALED_HAND,
                atLeastNumMeldsMinusOneAreConcealedSubPredicate,
                ifThereIsOnlyOneExposedMeldThenItIsMeldWithLastTileSubPredicate,
                ifLastTileWasDiscardThenItCompletedPairSubPredicate)(meldBasedWinningHand, winCtx, roundCtx, config);
        } else { // last discarded tile can complete any meld
            return predicateAnd(PointPredicateID.CONCEALED_HAND,
                // pair can count as one of the concealed melds
                atLeastNumMeldsMinusOneAreConcealedSubPredicate,
                ifThereIsOnlyOneExposedMeldThenItIsMeldWithLastTileSubPredicate)(meldBasedWinningHand, winCtx, roundCtx, config);
        }
    };

const fullyConcealedMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.FULLY_CONCEALED_HAND,
        everyMeldIsConcealedSubPredicate, SELF_DRAW_PREDICATE);

// since special hands are concealed except for the last tile, only need to check for a self drawn last tile
const fullyConcealedSpecialHandPredicate : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand: SpecialWinningHand) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.FULLY_CONCEALED_HAND, specialWinningHand.isSelfDrawn(), 
                    new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[specialWinningHand.winningTile]]).build(), 
                    new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[specialWinningHand.winningTile]]).build());
    }

export const SELF_TRIPLETS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.SELF_TRIPLETS, selfTripletsMeldBasedPredicate);
export const CONCEALED_HAND_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoSuccessSpecialPredicate(PointPredicateID.CONCEALED_HAND, concealedHandMeldBasedPredicate);
export const FULLY_CONCEALED_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouter(fullyConcealedMeldBasedPredicate, fullyConcealedSpecialHandPredicate);