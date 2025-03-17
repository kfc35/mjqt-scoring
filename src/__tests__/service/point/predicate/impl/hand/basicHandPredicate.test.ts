import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { Pair } from "model/meld/pair";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, EAST_WIND, EIGHT_CHARACTER, EIGHT_CIRCLE, 
    FIVE_CHARACTER, FOUR_BAMBOO, GREEN_DRAGON, NINE_BAMBOO, NINE_CHARACTER, NINE_CIRCLE, 
    NORTH_WIND, ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON, SEVEN_CHARACTER, 
    SIX_CHARACTER, SOUTH_WIND, THREE_BAMBOO, THREE_CHARACTER, TWO_BAMBOO, 
    TWO_CHARACTER, WEST_WIND, WHITE_DRAGON } from "common/deck";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { ALL_CHOWS_PREDICATE, SEVEN_PAIRS_PREDICATE } from "service/point/predicate/impl/hand/basicHandPredicate";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

describe('basicHandPredicate.ts', () => {
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('seven pairs predicate', () => {
        test('meld based hand with 7 pairs returns true', () => {
            const sevenPairs = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(TWO_BAMBOO)], 
                2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = SEVEN_PAIRS_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.SEVEN_PAIRS);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldsThatSatisfyPredicate).toStrictEqual(sevenPairs.melds);
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 3, 4, 5, 6]));
        });

        test('regular meld based hand returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = SEVEN_PAIRS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SEVEN_PAIRS);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.meldDetail?.meldsThatPartiallySatisfyPredicate).toStrictEqual([new Pair(EIGHT_CIRCLE)]);
            expect(failure.meldDetail?.meldIndicesThatPartiallySatisfyPredicate).toStrictEqual(new Set([1]));
            expect(failure.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), 
                new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])]);
            expect(failure.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([0, 2, 3, 4]));
        });

        test('special hand returns false', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);

            const result = SEVEN_PAIRS_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.SEVEN_PAIRS);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
        });
    });

    describe('all chows predicate', () => {
        test('all chows hand returns true', () => {
            const regularHand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), 
                new Pair(EIGHT_CIRCLE), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO]), 
                new Chow([FIVE_CHARACTER, SIX_CHARACTER, SEVEN_CHARACTER], true), 
                new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                2, TWO_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_CHOWS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_CHOWS);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
            const fourChowsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CHOWS) as PointPredicateSingleSuccessResult;
            expect(fourChowsResult.success).toBe(true);
            expect(fourChowsResult.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 2, 3, 4]));
            expect(fourChowsResult.meldDetail?.meldsThatSatisfyPredicate).toStrictEqual([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), 
                new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO]), 
                new Chow([FIVE_CHARACTER, SIX_CHARACTER, SEVEN_CHARACTER], true), 
                new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])]);
        });

        test('regular meld based hand with pongs returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = ALL_CHOWS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_CHOWS);
            expect(result.success).toBe(false);
            const fourChowsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CHOWS) as PointPredicateFailureResult;
            expect(fourChowsResult.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
            expect(fourChowsResult.meldDetail?.meldIndicesThatPartiallySatisfyPredicate).toStrictEqual(new Set([0, 4]));
            expect(fourChowsResult.meldDetail?.meldsThatPartiallySatisfyPredicate).toStrictEqual([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), 
                new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])]);
            expect(fourChowsResult.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([2, 3]));
            expect(fourChowsResult.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true)]);
        });

        test('special hand returns false', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);

            const result = ALL_CHOWS_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.ALL_CHOWS);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
        });
    });
});