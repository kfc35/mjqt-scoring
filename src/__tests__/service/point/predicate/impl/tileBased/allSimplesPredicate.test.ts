import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pair } from "model/meld/pair";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, EAST_WIND, FIVE_BAMBOO, FIVE_CHARACTER, FIVE_CIRCLE, FOUR_BAMBOO, GREEN_DRAGON, NINE_BAMBOO, 
    NINE_CHARACTER, NINE_CIRCLE, NORTH_WIND, ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON,
    SEVEN_BAMBOO, SIMPLE_TILES, SOUTH_WIND, THREE_BAMBOO, THREE_CHARACTER, TWO_BAMBOO, TWO_CHARACTER, TWO_CIRCLE, WEST_WIND, WHITE_DRAGON } from "common/deck";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { partitionTilesByGroup } from "common/tileUtils";
import { Chow } from "model/meld/chow";
import { ALL_SIMPLES_PREDICATE } from "service/point/predicate/impl/tileBased/allSimplesPredicate";

describe('allSimplesPredicate.ts', () => {
    const basicWinContext = new WinContextBuilder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('meld based winning hand', () => {

        test('regular hand with only simples returns true', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(THREE_CHARACTER), new Kong(SEVEN_BAMBOO), new Pair(TWO_CIRCLE),
                new Pong(FIVE_CIRCLE), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO])], 
                2, TWO_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_SIMPLES_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_SIMPLES);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 3, 4]));
            expect(new Set(success.tileDetail?.tilesThatSatisfyPredicate)).toStrictEqual(new Set([
                [TWO_CIRCLE, TWO_CIRCLE, TWO_BAMBOO], [THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, THREE_BAMBOO],
                [FOUR_BAMBOO], [FIVE_CIRCLE, FIVE_CIRCLE, FIVE_CIRCLE], [SEVEN_BAMBOO, SEVEN_BAMBOO, SEVEN_BAMBOO, SEVEN_BAMBOO]
            ]));
        });

        test('regular hand with only terminals returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_CHARACTER), new Pair(NINE_CIRCLE),
                new Pong(ONE_CIRCLE), new Pong(ONE_BAMBOO)], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_SIMPLES_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_SIMPLES);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([
                [ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER, ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE, ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO], 
                [NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CIRCLE, NINE_CIRCLE]]);
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(SIMPLE_TILES));
        });

        test('regular hand with honors and terminals returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pong(NORTH_WIND), new Pong(WHITE_DRAGON)], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_SIMPLES_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_SIMPLES);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([
                [NORTH_WIND, NORTH_WIND, NORTH_WIND], [WHITE_DRAGON, WHITE_DRAGON, WHITE_DRAGON],
                [ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER], 
                [NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE, NINE_CIRCLE]]);
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(SIMPLE_TILES));
        });

        test('regular hand with only honors returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(RED_DRAGON), new Kong(EAST_WIND), new Pair(WEST_WIND),
                new Pong(GREEN_DRAGON), new Pong(SOUTH_WIND)], 
                2, WEST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_SIMPLES_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_SIMPLES);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([
                [RED_DRAGON, RED_DRAGON, RED_DRAGON, GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON],
                [EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND, WEST_WIND, WEST_WIND, SOUTH_WIND, SOUTH_WIND, SOUTH_WIND]
            ]);
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(SIMPLE_TILES));
        });

        test('regular hand with honors, terminals, and simples returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pong(NORTH_WIND), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO])], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_SIMPLES_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_SIMPLES);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([
                [NORTH_WIND, NORTH_WIND, NORTH_WIND], [ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER],
                [NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE, NINE_CIRCLE]
            ]);
        });

        test('seven pairs hand with only simples returns true', () => {
            const sevenPairs = new MeldBasedWinningHand([new Pair(TWO_CHARACTER), new Pair(TWO_CHARACTER), new Pair(THREE_BAMBOO),
                new Pair(FIVE_BAMBOO), new Pair(TWO_BAMBOO), new Pair(FIVE_CHARACTER), new Pair(FIVE_CHARACTER)], 
                2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_SIMPLES_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_SIMPLES);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 3, 4, 5, 6]));
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [TWO_CHARACTER, TWO_CHARACTER, TWO_CHARACTER, TWO_CHARACTER, TWO_BAMBOO, TWO_BAMBOO], 
                [THREE_BAMBOO, THREE_BAMBOO], 
                [FIVE_BAMBOO, FIVE_BAMBOO, FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER]]);
        });
    });

    describe('special hand', () => {
        test('thirteen orphans hand returns false', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
            
            const result = ALL_SIMPLES_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_SIMPLES);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([
                [EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND], [RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON],
                [ONE_CHARACTER, ONE_BAMBOO, ONE_CIRCLE, ONE_CIRCLE], [NINE_CHARACTER, NINE_BAMBOO, NINE_CIRCLE]]);
        });
    });
});