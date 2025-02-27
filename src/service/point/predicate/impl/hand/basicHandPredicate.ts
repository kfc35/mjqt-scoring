import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { createPairQuantityPredicate } from "service/point/predicate/factory/meldBased/pairPredicateFactory";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { valuelessPairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { containsFourPongsKongsSubPredicate } from "service/point/predicate/impl/meld/meldQuantitySubPredicate";
import { containsFourKongsSubPredicate } from "service/point/predicate/impl/meld/meldQuantitySubPredicate";
import { containsFourChowsSubPredicate } from "service/point/predicate/impl/meld/meldQuantitySubPredicate";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "service/point/predicate/impl/util/pointPredicateUtil";
import { NO_GENTLEMEN_OR_SEASONS_PREDICATE } from "service/point/predicate/impl/flower/flowerPredicate";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "../../configuration/logic/pointPredicateLogicOption";
import { handContainsMoreThanOneSuitSubPredicate } from "service/point/predicate/impl/tileBased/tileBasedSharedSubPredicate";
import { consolidateSets } from "common/generic/setUtils";
import { SELF_DRAW_PREDICATE } from "service/point/predicate/impl/winCondition/basicWinConditionPredicate";

const sevenPairsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    createPairQuantityPredicate(PointPredicateID.SEVEN_PAIRS, 7, 7);
const allChowsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_CHOWS, onePairSubPredicate, containsFourChowsSubPredicate);
const allPongsKongsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_PONGS_AND_KONGS, onePairSubPredicate, containsFourPongsKongsSubPredicate);
const allKongsMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.ALL_KONGS, onePairSubPredicate, containsFourKongsSubPredicate);

const handContainsMoreThanOneSuitMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
    return handContainsMoreThanOneSuitSubPredicate(meldBasedWinningHand, suitedTileIndices);
};
const commonHandMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand: MeldBasedWinningHand, winCtx: WinContext, roundCtx: RoundContext, config: RootPointPredicateConfiguration) => {
        if (config.pointPredicateLogicConfiguration.getOptionValue(PointPredicateLogicOption.COMMON_HAND_MUST_HAVE_VALUELESS_PAIR)) { 
            return predicateAnd(PointPredicateID.COMMON_HAND, 
                allChowsMeldBasedPredicate, 
                handContainsMoreThanOneSuitMeldBasedPredicate,
                NO_GENTLEMEN_OR_SEASONS_PREDICATE,
                SELF_DRAW_PREDICATE,
                valuelessPairSubPredicate)(meldBasedWinningHand, winCtx, roundCtx, config);
        }
        return predicateAnd(PointPredicateID.COMMON_HAND, 
            allChowsMeldBasedPredicate, 
            handContainsMoreThanOneSuitMeldBasedPredicate,
            NO_GENTLEMEN_OR_SEASONS_PREDICATE,
            SELF_DRAW_PREDICATE)(meldBasedWinningHand, winCtx, roundCtx, config);
    }

export const SEVEN_PAIRS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.SEVEN_PAIRS, sevenPairsMeldBasedPredicate);
export const ALL_CHOWS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.ALL_CHOWS, allChowsMeldBasedPredicate);
export const ALL_PONGS_AND_KONGS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.ALL_PONGS_AND_KONGS, allPongsKongsMeldBasedPredicate);
export const ALL_KONGS_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.ALL_KONGS, allKongsMeldBasedPredicate);
export const COMMON_HAND_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.COMMON_HAND, commonHandMeldBasedPredicate);
