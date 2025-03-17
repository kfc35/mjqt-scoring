import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { Chow } from "model/meld/chow";
import { Pair } from "model/meld/pair";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { JADE_DRAGON_PREDICATE, PEARL_DRAGON_PREDICATE, RUBY_DRAGON_PREDICATE } from "service/point/predicate/impl/hand/jewelDragonPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { EIGHT_BAMBOO, FIVE_BAMBOO, FOUR_BAMBOO, GREEN_DRAGON, NINE_BAMBOO, THREE_BAMBOO, TWO_BAMBOO,
    AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, ONE_CIRCLE, TWO_CHARACTER, RED_DRAGON, EIGHT_CHARACTER,
    THREE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, FOUR_CHARACTER, FIVE_CHARACTER, TWO_CIRCLE,
    WHITE_DRAGON, NINE_CIRCLE, THREE_CIRCLE, EIGHT_CIRCLE, FOUR_CIRCLE, FIVE_CIRCLE, ONE_CHARACTER } from "common/deck";
import type { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import type { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";

describe('jewelDragonPredicate.ts', () => {
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('Jade Dragon Predicate', () => {
        test('all pong/kong bamboo hand with pong/kong of green dragon returns true', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_BAMBOO), new Pong(GREEN_DRAGON, true),
                new Kong(EIGHT_BAMBOO), new Pong(THREE_BAMBOO, true), new Pong(NINE_BAMBOO)], 
                4, NINE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = JADE_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.JADE_DRAGON);
            expect(result.success).toBe(true);
            const subpredResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON) as PointPredicateSingleSuccessResult
            expect(subpredResult.success).toBe(true);
            expect(subpredResult.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[TWO_BAMBOO, TWO_BAMBOO, 
                EIGHT_BAMBOO, EIGHT_BAMBOO, EIGHT_BAMBOO, EIGHT_BAMBOO, THREE_BAMBOO, THREE_BAMBOO, THREE_BAMBOO, 
                NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO], [GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON]]);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.GREEN_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('multi suit hand pong/kong of green dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_BAMBOO), new Pong(GREEN_DRAGON, true),
                new Kong(EIGHT_BAMBOO), new Pong(ONE_CIRCLE, true), new Pong(NINE_BAMBOO)], 
                4, NINE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = JADE_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.JADE_DRAGON);
            expect(result.success).toBe(false);
            const subpredResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON) as PointPredicateFailureResult
            expect(subpredResult.success).toBe(false);
            expect(subpredResult.tileDetail?.tilesThatFailPredicate).toStrictEqual([[ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE]]);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.GREEN_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('bamboo hand chow and pong/kong of green dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_BAMBOO), new Pong(GREEN_DRAGON, true),
                new Kong(EIGHT_BAMBOO), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Pong(NINE_BAMBOO)], 
                4, NINE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = JADE_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.JADE_DRAGON);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.GREEN_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('all pong/kong bamboo hand and pair of green dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(GREEN_DRAGON), new Pong(TWO_BAMBOO, true),
                new Kong(EIGHT_BAMBOO), new Pong(THREE_BAMBOO, true), new Pong(NINE_BAMBOO)], 
                4, NINE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = JADE_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.JADE_DRAGON);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.GREEN_DRAGON_PONG_KONG)?.success).toBe(false);
        });
    });

    describe('Ruby Dragon Predicate', () => {
        test('all pong/kong character hand with pong/kong of red dragon returns true', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_CHARACTER), new Pong(RED_DRAGON, true),
                new Kong(EIGHT_CHARACTER), new Pong(THREE_CHARACTER, true), new Pong(NINE_CHARACTER)], 
                4, NINE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = RUBY_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.RUBY_DRAGON);
            const subpredResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON) as PointPredicateSingleSuccessResult
            expect(subpredResult.success).toBe(true);
            expect(subpredResult.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[TWO_CHARACTER, TWO_CHARACTER, 
                EIGHT_CHARACTER, EIGHT_CHARACTER, EIGHT_CHARACTER, EIGHT_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, 
                NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER], [RED_DRAGON, RED_DRAGON, RED_DRAGON]]);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.RED_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('multi suit hand pong/kong of red dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_CHARACTER), new Pong(RED_DRAGON, true),
                new Kong(EIGHT_CHARACTER), new Pong(ONE_BAMBOO, true), new Pong(NINE_CHARACTER)], 
                4, NINE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = RUBY_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.RUBY_DRAGON);
            expect(result.success).toBe(false);
            const subpredResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON) as PointPredicateFailureResult
            expect(subpredResult.success).toBe(false);
            expect(subpredResult.tileDetail?.tilesThatFailPredicate).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO]]);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.RED_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('character hand chow and pong/kong of red dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_CHARACTER), new Pong(RED_DRAGON, true),
                new Kong(EIGHT_CHARACTER), new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true), new Pong(NINE_CHARACTER)], 
                4, NINE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = RUBY_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.RUBY_DRAGON);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.RED_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('all pong/kong character hand and pair of red dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(RED_DRAGON), new Pong(TWO_CHARACTER, true),
                new Kong(EIGHT_CHARACTER), new Pong(THREE_CHARACTER, true), new Pong(NINE_CHARACTER)], 
                4, NINE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = RUBY_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.RUBY_DRAGON);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.RED_DRAGON_PONG_KONG)?.success).toBe(false);
        });
    });

    describe('Pearl Dragon Predicate', () => {
        test('all pong/kong circle hand with pong/kong of white dragon returns true', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_CIRCLE), new Pong(WHITE_DRAGON, true),
                new Kong(EIGHT_CIRCLE), new Pong(THREE_CIRCLE, true), new Pong(NINE_CIRCLE)], 
                4, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = PEARL_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.PEARL_DRAGON);
            expect(result.success).toBe(true);
            const subpredResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON) as PointPredicateSingleSuccessResult
            expect(subpredResult.success).toBe(true);
            expect(subpredResult.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[TWO_CIRCLE, TWO_CIRCLE, 
                EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE, THREE_CIRCLE, THREE_CIRCLE, THREE_CIRCLE, 
                NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE], [WHITE_DRAGON, WHITE_DRAGON, WHITE_DRAGON]]);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.WHITE_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('multi suit hand pong/kong of white dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_CIRCLE), new Pong(WHITE_DRAGON, true),
                new Kong(EIGHT_CIRCLE), new Pong(ONE_CHARACTER, true), new Pong(NINE_CIRCLE)], 
                4, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = PEARL_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.PEARL_DRAGON);
            expect(result.success).toBe(false);
            const subpredResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON) as PointPredicateFailureResult
            expect(subpredResult.success).toBe(false);
            expect(subpredResult.tileDetail?.tilesThatFailPredicate).toStrictEqual([[ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER]]);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.WHITE_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('circle hand chow and pong/kong of white dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(TWO_CIRCLE), new Pong(WHITE_DRAGON, true),
                new Kong(EIGHT_CIRCLE), new Chow([THREE_CIRCLE, FOUR_CIRCLE, FIVE_CIRCLE], true), new Pong(NINE_CIRCLE)], 
                4, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = PEARL_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.PEARL_DRAGON);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WHITE_DRAGON_PONG_KONG)?.success).toBe(true);
        });

        test('all pong/kong circle hand and pair of white dragon returns false', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(WHITE_DRAGON), new Pong(TWO_CIRCLE, true),
                new Kong(EIGHT_CIRCLE), new Pong(THREE_CIRCLE, true), new Pong(NINE_CIRCLE)], 
                4, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = PEARL_DRAGON_PREDICATE(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.PEARL_DRAGON);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.ALL_PONGS_AND_KONGS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.WHITE_DRAGON_PONG_KONG)?.success).toBe(false);
        });
    });
});