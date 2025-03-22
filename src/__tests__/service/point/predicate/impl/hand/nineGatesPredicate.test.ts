import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { Pair } from "model/meld/pair";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, EAST_WIND, EIGHT_BAMBOO, 
    EIGHT_CHARACTER, 
    EIGHT_CIRCLE, 
    FIVE_BAMBOO, FIVE_CHARACTER, FIVE_CIRCLE, FOUR_BAMBOO, FOUR_CHARACTER, FOUR_CIRCLE, GREEN_DRAGON, NINE_BAMBOO, NINE_CHARACTER, NINE_CIRCLE, 
    NORTH_WIND, ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON, SEVEN_BAMBOO, 
    SEVEN_CHARACTER, 
    SEVEN_CIRCLE, 
    SIX_BAMBOO, SIX_CHARACTER, SIX_CIRCLE, SOUTH_WIND, THREE_BAMBOO, THREE_CHARACTER, THREE_CIRCLE, TWO_BAMBOO, TWO_CHARACTER, TWO_CIRCLE, WEST_WIND, WHITE_DRAGON } from "common/deck";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { NINE_GATES_PREDICATE } from "service/point/predicate/impl/hand/nineGatesPredicate";

describe('nineGatesPredicate.ts', () => {
    const basicWinContext = new WinContextBuilder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    test('nine gates hand with extra one returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pong(ONE_BAMBOO), 
            new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO]), 
            new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO]), 
            new Chow([SEVEN_BAMBOO, EIGHT_BAMBOO, NINE_BAMBOO]), 
            new Pair(NINE_BAMBOO)], 
            2, FOUR_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand with extra two returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), 
            new Pair(TWO_CHARACTER), 
            new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER]), 
            new Chow([SIX_CHARACTER, SEVEN_CHARACTER, EIGHT_CHARACTER]), 
            new Pong(NINE_CHARACTER)], 
            2, FOUR_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand with extra three returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pair(ONE_CIRCLE), 
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE]), 
            new Chow([THREE_CIRCLE, FOUR_CIRCLE, FIVE_CIRCLE]), 
            new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE]), 
            new Pong(NINE_CIRCLE)], 
            2, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand with extra four returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pong(ONE_BAMBOO), 
            new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO]), 
            new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO]),
            new Chow([SEVEN_BAMBOO, EIGHT_BAMBOO, NINE_BAMBOO]), 
            new Pair(NINE_BAMBOO)], 
            2, FOUR_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand with extra five returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), 
            new Chow([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER]), 
            new Pair(FIVE_CHARACTER), 
            new Chow([SIX_CHARACTER, SEVEN_CHARACTER, EIGHT_CHARACTER]), 
            new Pong(NINE_CHARACTER)], 
            2, FIVE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand with extra six returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pair(ONE_CIRCLE), 
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE]), 
            new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE]), 
            new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE]), 
            new Pong(NINE_CIRCLE)], 
            2, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand with extra seven returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pong(ONE_BAMBOO), 
            new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO]), 
            new Chow([FIVE_BAMBOO, SIX_BAMBOO, SEVEN_BAMBOO]),
            new Chow([SEVEN_BAMBOO, EIGHT_BAMBOO, NINE_BAMBOO]), 
            new Pair(NINE_BAMBOO)], 
            2, FIVE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand with extra eight returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), 
            new Chow([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER]), 
            new Chow([FIVE_CHARACTER, SIX_CHARACTER, SEVEN_CHARACTER]), 
            new Pair(EIGHT_CHARACTER), 
            new Pong(NINE_CHARACTER)], 
            2, FIVE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand with extra nine returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pair(ONE_CIRCLE), 
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE]), 
            new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE]), 
            new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, NINE_CIRCLE]), 
            new Pong(NINE_CIRCLE)], 
            2, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand won via discard and other melds unexposed returns true', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pair(ONE_CIRCLE), 
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE]), 
            new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE], true), 
            new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, NINE_CIRCLE]), 
            new Pong(NINE_CIRCLE)], 
            2, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('sufficient tile quantities nine gates but in two different suits returns false', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pair(ONE_CIRCLE), 
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE]), 
            new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE]), 
            new Chow([SEVEN_BAMBOO, EIGHT_BAMBOO, NINE_BAMBOO]), 
            new Pong(NINE_CIRCLE)], 
            2, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('all one suit hand but not nine gates returns false', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pair(ONE_CIRCLE), 
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE]), 
            new Pong(FOUR_CIRCLE), 
            new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, NINE_CIRCLE]), 
            new Pong(NINE_CIRCLE)], 
            2, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('nine gates hand won via self draw but one other meld exposed returns false', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pair(ONE_CIRCLE), 
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], true), 
            new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE]), 
            new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, NINE_CIRCLE]), 
            new Pong(NINE_CIRCLE)], 
            2, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(false);
    });

    test('nine gates hand with two melds exposed returns false', () => {
        const nineGatesWithExtraOne = new MeldBasedWinningHand([new Pair(ONE_CIRCLE), 
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], true), 
            new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE]), 
            new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, NINE_CIRCLE], true), 
            new Pong(NINE_CIRCLE)], 
            2, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

        const result = NINE_GATES_PREDICATE(nineGatesWithExtraOne, basicWinContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED)?.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
    });

    test('special hand returns false', () => {
        const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
            0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
        
        const result = NINE_GATES_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(result.pointPredicateId).toBe(PointPredicateID.NINE_GATES);
        expect(result.success).toBe(false);
    });
});