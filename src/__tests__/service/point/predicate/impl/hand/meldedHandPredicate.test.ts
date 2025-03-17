import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pong } from "model/meld/pong";
import { Pair } from "model/meld/pair";
import { Kong } from "model/meld/kong";
import { Chow } from "model/meld/chow";
import { FIVE_BAMBOO, FOUR_BAMBOO, THREE_BAMBOO, SEVEN_CHARACTER, EIGHT_CIRCLE,
    FIVE_CHARACTER, THREE_CHARACTER, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN,
    ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, ONE_CIRCLE, NINE_CIRCLE, 
    EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, WHITE_DRAGON, GREEN_DRAGON
 } from "common/deck";
import { FULLY_MELDED_HAND_PREDICATE, MELDED_HAND_PREDICATE } from "service/point/predicate/impl/hand/meldedHandPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";

describe('meldedHandPredicate.ts', () => {
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('Melded Hand Predicate', () => {
        describe('Allow Self Draw to Complete Pair = true', () => {
            describe('Last Discarded Tile Must Complete Pair = true', () => {
                beforeEach(() => {
                    rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR, true);
                    rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, true);
                });
            });

            describe('Last Discarded Tile Must Complete Pair = false', () => {
                beforeEach(() => {
                    rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR, true);
                    rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, false);
                });
            });
        });

        describe('Allow Self Draw to Complete Pair = false', () => {
            describe('Last Discarded Tile Must Complete Pair = true', () => {
                beforeEach(() => {
                    rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR, false);
                    rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, true);
                });

                test('Fully melded hand with win via discard for pair returns true',  () => {
                    const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                            new Pair(EIGHT_CIRCLE, true), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Kong(FIVE_CHARACTER, true), 
                            new Pong(THREE_CHARACTER, true)], 
                            1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
                    const result = MELDED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
        
                    expect(result.pointPredicateId).toBe(PointPredicateID.MELDED_HAND);
                    expect(result.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_NON_PAIR_MELDS_ARE_EXPOSED)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
                });
        
                test('win via discard but not completing pair returns false',  () => {
                    const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                            new Pair(EIGHT_CIRCLE), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Kong(FIVE_CHARACTER, true), 
                            new Pong(THREE_CHARACTER, true)], 
                            2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
                    const result = MELDED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
        
                    expect(result.pointPredicateId).toBe(PointPredicateID.MELDED_HAND);
                    expect(result.success).toBe(false);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_NON_PAIR_MELDS_ARE_EXPOSED)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(false);
                });
        
                test('hand won via discard on pair but hand not fully exposed returns false',  () => {
                    const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                            new Pair(EIGHT_CIRCLE, true), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Kong(FIVE_CHARACTER, true), 
                            new Pong(THREE_CHARACTER)], 
                            1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
                    const result = MELDED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
        
                    expect(result.pointPredicateId).toBe(PointPredicateID.MELDED_HAND);
                    expect(result.success).toBe(false);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_NON_PAIR_MELDS_ARE_EXPOSED)?.success).toBe(false);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
                });
        
                test('hand not won via discard on pair returns false',  () => {
                    const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                            new Pair(EIGHT_CIRCLE), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Kong(FIVE_CHARACTER, true), 
                            new Pong(THREE_CHARACTER, true)], 
                            1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
                    const result = MELDED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);
        
                    expect(result.pointPredicateId).toBe(PointPredicateID.MELDED_HAND);
                    expect(result.success).toBe(false);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_NON_PAIR_MELDS_ARE_EXPOSED)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW)?.success).toBe(false);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
                });
        
                test('special hand returns false', () => {
                    const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                        EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                        0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                
                    const result = MELDED_HAND_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
                
                    expect(result.pointPredicateId).toBe(PointPredicateID.MELDED_HAND);
                    expect(result.success).toBe(false);
                    expect(result instanceof PointPredicateFailureResult).toBe(true);
                });
            });

            describe('Last Discarded Tile Must Complete Pair = false', () => {
                beforeEach(() => {
                    rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR, false);
                    rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, false);
                });
            });
        });
    });

    describe('Fully Melded Hand Predicate Predicate', () => {
        test('Fully melded hand with win via discard for pair returns true',  () => {
            const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                    new Pair(EIGHT_CIRCLE, true), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Kong(FIVE_CHARACTER, true), 
                    new Pong(THREE_CHARACTER, true)], 
                    1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = FULLY_MELDED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_MELDED_HAND);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_EXPOSED)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
        });

        test('win via discard but not completing pair returns false',  () => {
            const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                    new Pair(EIGHT_CIRCLE), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Kong(FIVE_CHARACTER, true), 
                    new Pong(THREE_CHARACTER, true)], 
                    2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = FULLY_MELDED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_MELDED_HAND);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_EXPOSED)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(false);
        });

        test('hand won via discard on pair but hand not fully exposed returns false',  () => {
            const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                    new Pair(EIGHT_CIRCLE, true), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Kong(FIVE_CHARACTER, true), 
                    new Pong(THREE_CHARACTER)], 
                    1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = FULLY_MELDED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_MELDED_HAND);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_EXPOSED)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
        });

        test('hand not won via discard on pair returns false',  () => {
            const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                    new Pair(EIGHT_CIRCLE), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], true), new Kong(FIVE_CHARACTER, true), 
                    new Pong(THREE_CHARACTER, true)], 
                    1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = FULLY_MELDED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_MELDED_HAND);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_EXPOSED)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ONE_PAIR)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
        });

        test('special hand returns false', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
        
            const result = FULLY_MELDED_HAND_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_MELDED_HAND);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
        });
    });
});