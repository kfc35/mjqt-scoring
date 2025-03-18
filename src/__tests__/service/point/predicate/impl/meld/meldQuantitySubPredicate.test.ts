import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER, GREEN_DRAGON, THREE_CHARACTER, 
    ONE_CHARACTER, EIGHT_CIRCLE, TWO_CHARACTER, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN,
    BAMBOO_GENTLEMAN, TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO, FIVE_CHARACTER, SIX_CHARACTER } from "common/deck";
import { Pair } from "model/meld/pair";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { atLeastNumMeldsMinusOneAreChowsSubPredicate, atLeastNumMeldsMinusOneAreKongsSubPredicate, atLeastNumMeldsMinusOneArePongsKongsSubPredicate } from "service/point/predicate/impl/meld/meldQuantitySubPredicate";
import type { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import type { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";

describe('meldQuantitySubPredicate.ts', () => {
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('atLeastNumMeldsMinusOneAreChowsSubPredicate', () => {
        test('hand with one pair four chows returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), 
                            new Pair(EIGHT_CIRCLE), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO]), 
                            new Chow([FIVE_CHARACTER, SIX_CHARACTER, SEVEN_CHARACTER], true), 
                            new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, TWO_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = atLeastNumMeldsMinusOneAreChowsSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CHOWS);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 2, 3, 4]));
        });

        test('hand without four chows returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = atLeastNumMeldsMinusOneAreChowsSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                      
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CHOWS);
            expect(result.success).toBe(false);
            const failure = result as PointPredicateFailureResult;
            expect(failure.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([0, 4]));
            expect(failure.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true),
                new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])]);
        });
    });

    describe('atLeastNumMeldsMinusOneAreKongsSubPredicate', () => {
        test('hand with one pair four kongs returns true', () => {
            const hand = new MeldBasedWinningHand([new Kong(SEVEN_CHARACTER, true), 
                            new Pair(EIGHT_CIRCLE), new Kong(THREE_BAMBOO), new Kong(FIVE_CHARACTER, true), 
                            new Kong(THREE_CHARACTER)], 
                            1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = atLeastNumMeldsMinusOneAreKongsSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_KONGS);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 2, 3, 4]));
        });

        test('hand without four Kongs returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = atLeastNumMeldsMinusOneAreKongsSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                      
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_KONGS);
            expect(result.success).toBe(false);
            const failure = result as PointPredicateFailureResult;
            expect(failure.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([3]));
            expect(failure.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Kong(GREEN_DRAGON, true)]);
        });
    });

    describe('atLeastNumMeldsMinusOneArePongsKongsSubPredicate', () => {
        test('hand with one pair four pongs/kongs returns true', () => {
            const hand = new MeldBasedWinningHand([new Kong(SEVEN_CHARACTER, true), 
                            new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER, true), 
                            new Kong(THREE_CHARACTER)], 
                            2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = atLeastNumMeldsMinusOneArePongsKongsSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_PONGS_AND_KONGS);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 2, 3, 4]));
        });

        test('hand without four pongs/kongs returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = atLeastNumMeldsMinusOneArePongsKongsSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                      
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_PONGS_AND_KONGS);
            expect(result.success).toBe(false);
            const failure = result as PointPredicateFailureResult;
            expect(failure.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([2, 3]));
            expect(failure.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true),]);
        });
    });
});