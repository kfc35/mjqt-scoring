import { BAMBOO_TILES, CHARACTER_TILES, CIRCLE_TILES, DRAGON_TILES } from "common/deck";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { createPairsExistPredicate } from "service/point/predicate/factory/pairPredicateFactory";
import { PointPredicate, predicateOr } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { RoundContext } from "model/roundContext/roundContext";
import { WinContext } from "model/winContext/winContext";
import { PointPredicateConfiguration } from "service/point/predicate/configuration/pointPredicateConfiguration";
import { windDirectionToWindTile } from "model/roundContext/windDirection";

export const DRAGON_PAIR_SUBPREDICATE : PointPredicate<StandardWinningHand> = 
    createPairsExistPredicate(PointPredicateID.SUBPREDICATE_DRAGON_PAIR, DRAGON_TILES, 1);

export const VALUED_WIND_PAIR_SUBPREDICATE : PointPredicate<StandardWinningHand> = (standardWinningHand: StandardWinningHand, winContext: WinContext, roundContext: RoundContext, pointPredicateConfiguration: PointPredicateConfiguration) => {
    const valuedWindPredicate = createPairsExistPredicate(PointPredicateID.SUBPREDICATE_VALUED_WIND_PAIR, [roundContext.getSeatWindAsWindTile(), roundContext.getPrevailingWindAsWindTile()], 1);
    return valuedWindPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration);
}

export const VALUELESS_WIND_PAIR_SUBPREDICATE : PointPredicate<StandardWinningHand> = (standardWinningHand: StandardWinningHand, winContext: WinContext, roundContext: RoundContext, pointPredicateConfiguration: PointPredicateConfiguration) => {
    const valuelessWindPredicate = createPairsExistPredicate(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR, roundContext.otherWinds.map(windDirection => windDirectionToWindTile(windDirection)), 1);
    return valuelessWindPredicate(standardWinningHand, winContext, roundContext, pointPredicateConfiguration);
}

export const VALUELESS_SUITED_PAIR_SUBPREDICATE : PointPredicate<StandardWinningHand> = 
    createPairsExistPredicate(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR, [...BAMBOO_TILES, ...CIRCLE_TILES, ...CHARACTER_TILES], 1);

export const VALUELESS_PAIR_SUBPREDICATE : PointPredicate<StandardWinningHand> = predicateOr(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR,
    VALUELESS_WIND_PAIR_SUBPREDICATE, VALUELESS_SUITED_PAIR_SUBPREDICATE);