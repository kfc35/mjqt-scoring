import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { BIG_THREE_DRAGONS_PREDICATE, GREEN_DRAGON_PONG_KONG_PREDICATE, RED_DRAGON_PONG_KONG_PREDICATE, SMALL_THREE_DRAGONS_PREDICATE, WHITE_DRAGON_PONG_KONG_PREDICATE } from "service/point/predicate/impl/meld/dragonPongPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER, GREEN_DRAGON, THREE_CHARACTER, 
    ONE_CHARACTER, EIGHT_CIRCLE, TWO_CHARACTER, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN,
    BAMBOO_GENTLEMAN, NORTH_WIND, RED_DRAGON, WHITE_DRAGON, THREE_CIRCLE} from "common/deck";
import { Pair } from "model/meld/pair";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";

describe('dragonPongPredicate.ts', () => {
    const basicWinContext = new WinContextBuilder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('green dragon pong/pong', () => {
        test('hand with green dragon pong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = GREEN_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.GREEN_DRAGON_PONG_KONG);
            expect(result.success).toBe(true);
        });

        test('hand with green dragon kong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(GREEN_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = GREEN_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.GREEN_DRAGON_PONG_KONG);
            expect(result.success).toBe(true);
        });

        test('hand without green dragon kong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = GREEN_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.GREEN_DRAGON_PONG_KONG);
            expect(result.success).toBe(false);
        });
    });

    describe('red dragon pong/pong', () => {
        test('hand with red dragon pong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(RED_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = RED_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.RED_DRAGON_PONG_KONG);
            expect(result.success).toBe(true);
        });

        test('hand with red dragon kong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(RED_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = RED_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.RED_DRAGON_PONG_KONG);
            expect(result.success).toBe(true);
        });

        test('hand without red dragon kong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = RED_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.RED_DRAGON_PONG_KONG);
            expect(result.success).toBe(false);
        });
    });

    describe('white dragon pong/pong', () => {
        test('hand with white dragon pong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(WHITE_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = WHITE_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.WHITE_DRAGON_PONG_KONG);
            expect(result.success).toBe(true);
        });

        test('hand with white dragon kong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(WHITE_DRAGON, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = WHITE_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.WHITE_DRAGON_PONG_KONG);
            expect(result.success).toBe(true);
        });

        test('hand without white dragon kong returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = WHITE_DRAGON_PONG_KONG_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.WHITE_DRAGON_PONG_KONG);
            expect(result.success).toBe(false);
        });
    });

    describe('small three dragons', () => {
        test('hand with red and white dragon pong/kong, green dragon pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(GREEN_DRAGON), 
                            new Pong(THREE_CHARACTER), new Pong(WHITE_DRAGON, true), new Kong(RED_DRAGON)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = SMALL_THREE_DRAGONS_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_THREE_DRAGONS);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_TWO_DRAGONS_PONG_KONG)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_DRAGON_PAIR)?.success).toBe(true);
        });

        test('hand with red and green dragon pong/kong, white dragon pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(WHITE_DRAGON), 
                            new Pong(THREE_CHARACTER), new Pong(RED_DRAGON, true), new Kong(GREEN_DRAGON)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = SMALL_THREE_DRAGONS_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_THREE_DRAGONS);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_TWO_DRAGONS_PONG_KONG)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_DRAGON_PAIR)?.success).toBe(true);
        });

        test('hand with green and white dragon pong/kong, red dragon pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(RED_DRAGON), 
                            new Pong(THREE_CHARACTER), new Pong(GREEN_DRAGON, true), new Kong(WHITE_DRAGON)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = SMALL_THREE_DRAGONS_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_THREE_DRAGONS);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_TWO_DRAGONS_PONG_KONG)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_DRAGON_PAIR)?.success).toBe(true);
        });

        test('hand with dragon pair but without two dragon pong/kongs returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(RED_DRAGON), 
                            new Pong(THREE_CHARACTER), new Kong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = SMALL_THREE_DRAGONS_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_THREE_DRAGONS);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_TWO_DRAGONS_PONG_KONG)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_DRAGON_PAIR)?.success).toBe(true);
        });

        test('hand with two dragon pong/kongs but without dragon pair returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(THREE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Kong(RED_DRAGON, true), new Pong(WHITE_DRAGON)], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = SMALL_THREE_DRAGONS_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.SMALL_THREE_DRAGONS);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_TWO_DRAGONS_PONG_KONG)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_DRAGON_PAIR)?.success).toBe(false);
        });
    });

    describe('big three dragons', () => {
        test('hand with red, white, and green dragon pongs/kongs returns true', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(NORTH_WIND), 
                            new Pong(GREEN_DRAGON), new Pong(WHITE_DRAGON, true), new Kong(RED_DRAGON)], 
                            2, GREEN_DRAGON, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = BIG_THREE_DRAGONS_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.BIG_THREE_DRAGONS);
            expect(result.success).toBe(true);
        });

        test('hand with only two dragon pongs/kongs returns false', () => {
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(GREEN_DRAGON), 
                            new Pong(NORTH_WIND), new Pong(WHITE_DRAGON, true), new Kong(RED_DRAGON)], 
                            2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = BIG_THREE_DRAGONS_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(result.pointPredicateId).toBe(PointPredicateID.BIG_THREE_DRAGONS);
            expect(result.success).toBe(false);
        });
    });
});