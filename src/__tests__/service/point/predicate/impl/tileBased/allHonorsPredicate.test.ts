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
    SOUTH_WIND, THREE_BAMBOO, THREE_CHARACTER, TWO_BAMBOO, WEST_WIND, WHITE_DRAGON } from "common/deck";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { partitionTilesByGroup } from "common/tileUtils";
import { Chow } from "model/meld/chow";
import { ALL_HONORS_PREDICATE } from "service/point/predicate/impl/tileBased/allHonorsPredicate";

describe('allHonorsPredicate.ts', () => {
    const basicWinContext = new WinContextBuilder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('meld based winning hand', () => {

        test('regular hand with only honors returns true', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(RED_DRAGON), new Kong(EAST_WIND), new Pair(WEST_WIND),
                new Pong(GREEN_DRAGON), new Pong(SOUTH_WIND)], 
                2, WEST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)?.success).toBe(true);
            const successContainsHonors = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS) as PointPredicateSingleSuccessResult;
            expect(successContainsHonors.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 3, 4]));
            expect(successContainsHonors.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [RED_DRAGON, RED_DRAGON, RED_DRAGON, GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON], 
                [EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND, WEST_WIND, WEST_WIND, SOUTH_WIND, SOUTH_WIND, SOUTH_WIND]]);
        });

        test('regular hand with honors and terminals returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pong(NORTH_WIND), new Pong(WHITE_DRAGON)], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)?.success).toBe(true);
            const failureNoSuits = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS) as PointPredicateFailureResult;
            expect(failureNoSuits.meldDetail).toBeUndefined();
            expect(failureNoSuits.tileDetail?.tilesThatFailPredicate).toStrictEqual([
                [ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER], [NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO], 
                [NINE_CIRCLE, NINE_CIRCLE]]);
            const successContainsHonors = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS) as PointPredicateSingleSuccessResult;
            expect(successContainsHonors.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 4]));
            expect(successContainsHonors.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [NORTH_WIND, NORTH_WIND, NORTH_WIND], [WHITE_DRAGON, WHITE_DRAGON, WHITE_DRAGON]]);
        });

        test('regular hand without honors returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pong(THREE_CHARACTER), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO])], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)?.success).toBe(false);
            const failureNoSuits = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS) as PointPredicateFailureResult;
            expect(failureNoSuits.meldDetail).toBeUndefined();
            expect(failureNoSuits.tileDetail?.tilesThatFailPredicate).toStrictEqual([
                [ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER], 
                [NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], 
                [NINE_CIRCLE, NINE_CIRCLE]]);
            const failureContainsHonors = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS) as PointPredicateFailureResult;
            expect(failureContainsHonors.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(HONOR_TILES));
        });

        test('seven pairs hand with only honors returns true', () => {
            const sevenPairs = new MeldBasedWinningHand([new Pair(WEST_WIND), new Pair(EAST_WIND), new Pair(EAST_WIND),
                new Pair(NORTH_WIND), new Pair(WHITE_DRAGON), new Pair(WHITE_DRAGON), new Pair(GREEN_DRAGON)], 
                2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_HONORS_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)?.success).toBe(true);
            const successContainsHonors = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS) as PointPredicateSingleSuccessResult;
            expect(successContainsHonors.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 3, 4, 5, 6]));
            expect(successContainsHonors.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [WEST_WIND, WEST_WIND,EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND, NORTH_WIND, NORTH_WIND],
                [WHITE_DRAGON, WHITE_DRAGON, WHITE_DRAGON, WHITE_DRAGON, GREEN_DRAGON, GREEN_DRAGON], 
            ]);
        });
    });

    describe('special hand', () => {
        test('thirteen orphans hand returns false', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
            
            const result = ALL_HONORS_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_HONORS);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS)?.success).toBe(true);
            const failureNoSuits = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS) as PointPredicateFailureResult;
            expect(failureNoSuits.meldDetail).toBeUndefined();
            expect(failureNoSuits.tileDetail?.tilesThatFailPredicate).toStrictEqual([
                [ONE_CHARACTER, NINE_CHARACTER], [ONE_BAMBOO, NINE_BAMBOO], [NINE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE]]);
        });
    });
});