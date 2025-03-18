import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER, THREE_CHARACTER, 
    ONE_CHARACTER, EIGHT_CIRCLE, TWO_CHARACTER, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN,
    BAMBOO_GENTLEMAN, EAST_WIND, GREEN_DRAGON,
    WEST_WIND,
    RED_DRAGON,
    NORTH_WIND,
    SOUTH_WIND} from "common/deck";
import { Pair } from "model/meld/pair";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { BIG_FOUR_WINDS_PREDICATE, PREVAILING_WIND_PONG_KONG_PREDICATE, SEAT_WIND_PONG_KONG_PREDICATE, SMALL_FOUR_WINDS_PREDICATE } from "service/point/predicate/impl/meld/windPongPredicate";
import type { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";

describe('windPongPredicate.ts', () => {
    const basicWinContext = new WinContext.Builder().build();
    const westPrevailingEastSeatRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('seat wind pong/kong', () => {
        test('hand with seat wind pong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(EAST_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = SEAT_WIND_PONG_KONG_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SEAT_WIND_PONG_KONG);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3]));
        });

        test('hand with seat wind kong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(EAST_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = SEAT_WIND_PONG_KONG_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SEAT_WIND_PONG_KONG);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3]));
        });


        test('hand without seat wind pong/kong returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = SEAT_WIND_PONG_KONG_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SEAT_WIND_PONG_KONG);
            expect(result.success).toBe(false);
        });
    });

    describe('prevailing wind pong/kong', () => {
        test('hand with prevailing wind pong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(WEST_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = PREVAILING_WIND_PONG_KONG_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.PREVAILING_WIND_PONG_KONG);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3]));
        });

        test('hand with prevailing wind kong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(WEST_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = PREVAILING_WIND_PONG_KONG_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.PREVAILING_WIND_PONG_KONG);
            expect(result.success).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3]));
        });


        test('hand without prevailing wind pong/kong returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = PREVAILING_WIND_PONG_KONG_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.PREVAILING_WIND_PONG_KONG);
            expect(result.success).toBe(false);
        });

        describe('small four winds', () => {
                test('hand with east, south, west pong/kong, north dragon pair returns true', () => {
                    const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(NORTH_WIND), 
                                    new Pong(EAST_WIND), new Pong(SOUTH_WIND, true), new Kong(WEST_WIND)], 
                                    2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                    
                    const result = SMALL_FOUR_WINDS_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                                
                    expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_FOUR_WINDS);
                    expect(result.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_THREE_WINDS_PONG_KONG)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIND_PAIR)?.success).toBe(true);
                });

                test('hand with east, south, north pong/kong, west dragon pair returns true', () => {
                    const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(WEST_WIND), 
                                    new Pong(EAST_WIND), new Pong(SOUTH_WIND, true), new Kong(NORTH_WIND)], 
                                    2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                    
                    const result = SMALL_FOUR_WINDS_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                                
                    expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_FOUR_WINDS);
                    expect(result.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_THREE_WINDS_PONG_KONG)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIND_PAIR)?.success).toBe(true);
                });

                test('hand with south, west, north pong/kong, east dragon pair returns true', () => {
                    const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EAST_WIND), 
                                    new Pong(WEST_WIND), new Pong(SOUTH_WIND, true), new Kong(NORTH_WIND)], 
                                    2, WEST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                    
                    const result = SMALL_FOUR_WINDS_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                                
                    expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_FOUR_WINDS);
                    expect(result.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_THREE_WINDS_PONG_KONG)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIND_PAIR)?.success).toBe(true);
                });

                test('hand with east, west, north pong/kong, south dragon pair returns true', () => {
                    const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(SOUTH_WIND), 
                                    new Pong(WEST_WIND), new Pong(NORTH_WIND, true), new Kong(EAST_WIND)], 
                                    2, WEST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                    
                    const result = SMALL_FOUR_WINDS_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                                
                    expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_FOUR_WINDS);
                    expect(result.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_THREE_WINDS_PONG_KONG)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIND_PAIR)?.success).toBe(true);
                });
        
                test('hand with wind pair but without three wind pong/kongs returns false', () => {
                    const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(NORTH_WIND), 
                                    new Pong(EAST_WIND), new Pong(SOUTH_WIND, true), new Kong(GREEN_DRAGON)], 
                                    2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                    
                    const result = SMALL_FOUR_WINDS_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                                
                    expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_FOUR_WINDS);
                    expect(result.success).toBe(false);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_THREE_WINDS_PONG_KONG)?.success).toBe(false);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIND_PAIR)?.success).toBe(true);
                });
        
                test('hand with three wind pong/kongs but without wind pair returns false', () => {
                    const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(GREEN_DRAGON), 
                                    new Pong(EAST_WIND), new Pong(SOUTH_WIND, true), new Kong(WEST_WIND)], 
                                    2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                    
                    const result = SMALL_FOUR_WINDS_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                                
                    expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_FOUR_WINDS);
                    expect(result.success).toBe(false);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_THREE_WINDS_PONG_KONG)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIND_PAIR)?.success).toBe(false);
                });
            });
        
            describe('big four winds', () => {
                test('hand with all four wind pongs/kongs returns true', () => {
                    const hand = new MeldBasedWinningHand([new Kong(NORTH_WIND, true), new Pair(RED_DRAGON), 
                                    new Pong(WEST_WIND, true), new Pong(EAST_WIND, true), new Kong(SOUTH_WIND)], 
                                    2, WEST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                    
                    const result = BIG_FOUR_WINDS_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                                
                    expect(result.pointPredicateId).toBe(PointPredicateID.BIG_FOUR_WINDS);
                    expect(result.success).toBe(true);
                });
        
                test('hand with only three wind pongs/kongs returns false', () => {
                    const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(NORTH_WIND), 
                                    new Pong(WEST_WIND, true), new Pong(EAST_WIND, true), new Kong(SOUTH_WIND)], 
                                    2, WEST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                    
                    const result = BIG_FOUR_WINDS_PREDICATE(hand, basicWinContext, westPrevailingEastSeatRoundContext, rootConfig);
                                
                    expect(result.pointPredicateId).toBe(PointPredicateID.BIG_FOUR_WINDS);
                    expect(result.success).toBe(false);
                });
            });
    });
});