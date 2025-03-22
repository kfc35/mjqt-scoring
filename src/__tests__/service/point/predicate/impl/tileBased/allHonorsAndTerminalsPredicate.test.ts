import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pair } from "model/meld/pair";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, EAST_WIND, FOUR_BAMBOO, GREEN_DRAGON, HONOR_TILES, NINE_BAMBOO, 
    NINE_CHARACTER, NINE_CIRCLE, NORTH_WIND, ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON,
    SOUTH_WIND, TERMINAL_TILES, THREE_BAMBOO, TWO_BAMBOO, WEST_WIND, WHITE_DRAGON } from "common/deck";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { ALL_HONORS_AND_TERMINALS_PREDICATE } from "service/point/predicate/impl/tileBased/allHonorsAndTerminalsPredicate";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { partitionTilesByGroup } from "common/tileUtils";
import { Chow } from "model/meld/chow";

describe('allHonorsAndTerminalsPredicate.ts', () => {
    const basicWinContext = new WinContextBuilder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('meld based winning hand', () => {
        test('regular hand with only honors and terminals returns true', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pong(NORTH_WIND), new Pong(WHITE_DRAGON)], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_AND_TERMINALS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS_AND_TERMINALS);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 3, 4]));
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER], [NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE, NINE_CIRCLE],
                [NORTH_WIND, NORTH_WIND, NORTH_WIND], [WHITE_DRAGON, WHITE_DRAGON, WHITE_DRAGON]]);
        });

        test('regular hand without honors and only terminals returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_CHARACTER), new Pair(NINE_CIRCLE),
                new Pong(ONE_CIRCLE), new Pong(ONE_BAMBOO)], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_AND_TERMINALS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS_AND_TERMINALS);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([]);
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(HONOR_TILES));
        });

        test('regular hand without terminals and only honors returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(RED_DRAGON), new Kong(EAST_WIND), new Pair(WEST_WIND),
                new Pong(GREEN_DRAGON), new Pong(SOUTH_WIND)], 
                2, WEST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_AND_TERMINALS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS_AND_TERMINALS);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([]);
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(TERMINAL_TILES));
        });

        test('regular hand with honors, terminals, and simples returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pong(NORTH_WIND), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO])], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_AND_TERMINALS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS_AND_TERMINALS);
            expect(result.success).toBe(false);
            
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([[TWO_BAMBOO], [THREE_BAMBOO], [FOUR_BAMBOO]]);
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual([]);
        });

        test('seven pairs hand with only honors and terminals returns true', () => {
            const sevenPairs = new MeldBasedWinningHand([new Pair(ONE_CHARACTER), new Pair(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(GREEN_DRAGON)], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_AND_TERMINALS_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS_AND_TERMINALS);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 3, 4, 5, 6]));
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER], [NINE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE, NINE_CIRCLE],
                [NORTH_WIND, NORTH_WIND], [WHITE_DRAGON, WHITE_DRAGON, GREEN_DRAGON, GREEN_DRAGON]]);
        });
    });

    describe('special hand', () => {
        test('thirteen orphans hand returns true', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
            
            const result = ALL_HONORS_AND_TERMINALS_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS_AND_TERMINALS);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail).toBeUndefined();
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [ONE_CHARACTER, ONE_BAMBOO, ONE_CIRCLE, ONE_CIRCLE], [NINE_CHARACTER, NINE_BAMBOO, NINE_CIRCLE],
                [EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND], [RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON]]);
        });
    });
});