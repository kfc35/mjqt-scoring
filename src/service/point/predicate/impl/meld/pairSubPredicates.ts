import { BAMBOO_TILES, CHARACTER_TILES, CIRCLE_TILES, DRAGON_TILES, WIND_TILES } from "common/deck";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { createPairQuantityPredicate } from "service/point/predicate/factory/meldBased/pairPredicateFactory";
import { createPairsExistPredicate } from "service/point/predicate/factory/meldBased/pairPredicateFactory";
import { PointPredicate, predicateOr } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { RoundContext } from "model/roundContext/roundContext";
import WinContext from "model/winContext/winContext";
import { windDirectionToWindTile } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";

export const onePairSubPredicate : PointPredicate<MeldBasedWinningHand> = createPairQuantityPredicate(PointPredicateID.SUBPREDICATE_ONE_PAIR, 1, 1);

export const dragonPairSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    createPairsExistPredicate(PointPredicateID.SUBPREDICATE_DRAGON_PAIR, DRAGON_TILES, 1, 1);

export const valuedWindPairSubPredicate : PointPredicate<MeldBasedWinningHand> = (standardWinningHand: MeldBasedWinningHand, winContext: WinContext, roundContext: RoundContext, config: RootPointPredicateConfiguration) => {
    const valuedWindPredicate = createPairsExistPredicate(PointPredicateID.SUBPREDICATE_VALUED_WIND_PAIR, [roundContext.getSeatWindAsWindTile(), roundContext.getPrevailingWindAsWindTile()], 1, 1);
    return valuedWindPredicate(standardWinningHand, winContext, roundContext, config);
}

export const valuelessWindPairSubPredicate : PointPredicate<MeldBasedWinningHand> = (standardWinningHand: MeldBasedWinningHand, winContext: WinContext, roundContext: RoundContext, config: RootPointPredicateConfiguration) => {
    const valuelessWindPredicate = createPairsExistPredicate(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR, roundContext.otherWinds.map(windDirection => windDirectionToWindTile(windDirection)), 1, 1);
    return valuelessWindPredicate(standardWinningHand, winContext, roundContext, config);
}

export const windPairSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    createPairsExistPredicate(PointPredicateID.SUBPREDICATE_WIND_PAIR, WIND_TILES, 1, 1);

export const valuelessSuitedPairSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    createPairsExistPredicate(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR, [...BAMBOO_TILES, ...CIRCLE_TILES, ...CHARACTER_TILES], 1, 1);

export const valuelessPairSubPredicate : PointPredicate<MeldBasedWinningHand> = predicateOr(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR,
    valuelessWindPairSubPredicate, valuelessSuitedPairSubPredicate);