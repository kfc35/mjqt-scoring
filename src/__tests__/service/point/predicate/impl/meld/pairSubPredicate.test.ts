import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER, GREEN_DRAGON, THREE_CHARACTER, 
    ONE_CHARACTER, EIGHT_CIRCLE, TWO_CHARACTER, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN,
    BAMBOO_GENTLEMAN, TWO_BAMBOO, NORTH_WIND, WHITE_DRAGON, 
    RED_DRAGON,
    WEST_WIND,
    EAST_WIND,
    SOUTH_WIND} from "common/deck";
import { Pair } from "model/meld/pair";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { dragonPairSubPredicate, onePairSubPredicate, valuedWindPairSubPredicate, 
    valuelessPairSubPredicate, valuelessSuitedPairSubPredicate, valuelessWindPairSubPredicate, windPairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";

describe('pairSubPredicate.ts', () => {
    const basicWinContext = new WinContextBuilder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('onePairSubPredicate', () => {
        test('hand with one pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = onePairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_ONE_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1]));
        });

        test('hand with seven pairs returns false', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = onePairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_ONE_PAIR);
            expect(result.success).toBe(false);
            const failure = result as PointPredicateFailureResult;
            expect(failure.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([0, 1, 2, 3, 4, 5, 6]));
        });
    });

    describe('dragonPairSubPredicate', () => {
        test('hand with dragon pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(RED_DRAGON), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = dragonPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_DRAGON_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1]));
        });

        test('hand without dragon pair returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = dragonPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_DRAGON_PAIR);
            expect(result.success).toBe(false);
        });

        test('seven pairs hand with one dragon pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = dragonPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_DRAGON_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([5]));
        });

        test('hand with more than one different dragon pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(GREEN_DRAGON), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = dragonPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_DRAGON_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 5]));
        });

        test('hand with more than one of the same dragon pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(GREEN_DRAGON), new Pair(ONE_CHARACTER), new Pair(GREEN_DRAGON), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = dragonPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_DRAGON_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 5]));
        });
    });

    describe('valuedWindPairSubPredicate', () => {
        test('hand with valued wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(WEST_WIND), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuedWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUED_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1]));
        });

        test('hand without valued wind pair returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuedWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUED_WIND_PAIR);
            expect(result.success).toBe(false);
        });

        test('seven pairs hand with one valued wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WEST_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuedWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUED_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([5]));
        });

        test('hand with more than one different valued wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(EAST_WIND), new Pair(ONE_CHARACTER), new Pair(WEST_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuedWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUED_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 5]));
        });

        test('hand with more than one of the same valued wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(EAST_WIND), new Pair(ONE_CHARACTER), new Pair(EAST_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuedWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUED_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 5]));
        });
    });

    describe('valuelessWindPairSubPredicate', () => {
        test('hand with valueless wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(NORTH_WIND), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1]));
        });

        test('hand without valueless wind pair returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EAST_WIND), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR);
            expect(result.success).toBe(false);
        });

        test('seven pairs hand with one valueless wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WEST_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3]));
        });

        test('hand with more than one different valueless wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(SOUTH_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 5]));
        });

        test('hand with more than one of the same valueless wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(NORTH_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessWindPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 5]));
        });
    });

    describe('windPairSubPredicate', () => {
        test('hand with wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(NORTH_WIND), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = windPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1]));
        });

        test('hand without wind pair returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = windPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIND_PAIR);
            expect(result.success).toBe(false);
        });

        test('seven pairs hand with one wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = windPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3]));
        });

        test('hand with more than one different wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(EAST_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = windPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 5]));
        });

        test('hand with more than one of the same wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(NORTH_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = windPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIND_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 5]));
        });
    });

    describe('valuelessSuitedPairSubPredicate', () => {
        test('hand with valueless suited pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessSuitedPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1]));
        });

        test('hand without valueless suited pair returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(NORTH_WIND), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessSuitedPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR);
            expect(result.success).toBe(false);
        });

        test('seven pairs hand with one valueless suited pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(EAST_WIND), new Pair(EAST_WIND), new Pair(THREE_CHARACTER, true),
                            new Pair(NORTH_WIND), new Pair(GREEN_DRAGON), new Pair(WHITE_DRAGON), new Pair(RED_DRAGON)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessSuitedPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([2]));
        });

        test('hand with more than one different valueless suited pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(EAST_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessSuitedPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 4, 6]));
        });

        test('hand with more than one of the same valueless suited pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(EAST_WIND), new Pair(THREE_CHARACTER), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(RED_DRAGON), new Pair(NORTH_WIND), new Pair(WHITE_DRAGON)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessSuitedPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1, 2]));
        });
    });

    describe('valuelessPairSubPredicate', () => {
        test('hand with valueless suited pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR);
            expect(result.success).toBe(true);
            const success = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR) as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1]));
        });

        test('hand with valueless wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(NORTH_WIND), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR);
            expect(result.success).toBe(true);
            const success = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR) as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1]));
        });

        test('hand without valueless suited pair returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(RED_DRAGON), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR);
            expect(result.success).toBe(false);
        });

        test('seven pairs hand with one valueless suited pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(EAST_WIND), new Pair(EAST_WIND), new Pair(THREE_CHARACTER, true),
                            new Pair(WEST_WIND), new Pair(GREEN_DRAGON), new Pair(WHITE_DRAGON), new Pair(RED_DRAGON)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR);
            expect(result.success).toBe(true);
            const success = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR) as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([2]));
        });

        test('seven pairs hand with one valueless wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(EAST_WIND), new Pair(EAST_WIND), new Pair(NORTH_WIND, true),
                            new Pair(WEST_WIND), new Pair(GREEN_DRAGON), new Pair(WHITE_DRAGON), new Pair(RED_DRAGON)], 
                            2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR);
            expect(result.success).toBe(true);
            const success = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR) as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([2]));
        });

        test('hand with more than one different valueless pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                            new Pair(NORTH_WIND), new Pair(NORTH_WIND), new Pair(EAST_WIND), new Pair(TWO_BAMBOO)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR);
            expect(result.success).toBe(true);
            const successValuelessSuited = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR) as PointPredicateSingleSuccessResult;
            expect(successValuelessSuited.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 6]));
            const successValuelessWind = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR) as PointPredicateSingleSuccessResult;
            expect(successValuelessWind.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3, 4]));
        });

        test('hand with more than one of the same valueless suited pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(EAST_WIND), new Pair(THREE_CHARACTER), new Pair(THREE_CHARACTER),
                            new Pair(EAST_WIND), new Pair(RED_DRAGON), new Pair(WEST_WIND), new Pair(WHITE_DRAGON)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR);
            expect(result.success).toBe(true);
            const success = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_VALUELESS_SUITED_PAIR) as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1, 2]));
        });

        test('hand with more than one of the same valueless wind pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pair(EAST_WIND), new Pair(NORTH_WIND), new Pair(NORTH_WIND),
                            new Pair(EAST_WIND), new Pair(RED_DRAGON), new Pair(WEST_WIND), new Pair(WHITE_DRAGON)], 
                            2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = valuelessPairSubPredicate(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_VALUELESS_PAIR);
            expect(result.success).toBe(true);
            const success = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_VALUELESS_WIND_PAIR) as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([1, 2]));
        });
    });
});