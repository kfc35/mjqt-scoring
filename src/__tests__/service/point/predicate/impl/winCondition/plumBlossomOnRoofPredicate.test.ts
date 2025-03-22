import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { Pair } from "model/meld/pair";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";
import { ONE_CIRCLE, SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER, THREE_CHARACTER, 
    NORTH_WIND, ONE_CHARACTER, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN,
    ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE, EAST_WIND, SOUTH_WIND, WEST_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON,
    FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE, 
    SEVEN_CIRCLE} from "common/deck";
import { PLUM_BLOSSOM_ON_ROOF_PREDICATE } from "service/point/predicate/impl/winCondition/plumBlossomOnRoofPredicate";

describe('plumBlossomOnRoofPredicate.ts', () => {   
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('any replacement allowed = true', () => {
        beforeEach(() => {
            rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED, true);
        });

        test('winByKongReplacement = true and last tile is 5 circle in 4 5 6 circle chow returns true', () => {
            const winContext = new WinContextBuilder().winByKongReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('winByKongOnKongReplacement = true and last tile is 5 circle in 4 5 6 circle chow returns true', () => {
            const winContext = new WinContextBuilder().winByKongOnKongReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('winByFlowerReplacement = true and last tile is 5 circle in 4 5 6 circle chow returns true', () => {
            const winContext = new WinContextBuilder().winByFlowerReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('no win by replacement and last tile is 5 circle in 4 5 6 circle chow returns false', () => {
            const winContext = new WinContextBuilder().build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('winByKongReplacement = true and last tile is 6 circle in 4 5 6 circle chow returns false', () => {
            const winContext = new WinContextBuilder().winByKongReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, SIX_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('winByKongReplacement = true and last tile is 5 circle in 5 6 7 circle chow returns false', () => {
            const winContext = new WinContextBuilder().winByKongReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(false);
        });
    });

    describe('any replacement allowed = false', () => {
        beforeEach(() => {
            rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED, false);
        });

        test('winByKongReplacement = true and last tile is 5 circle in 4 5 6 circle chow returns true', () => {
            const winContext = new WinContextBuilder().winByKongReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_KONG)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('winByKongOnKongReplacement = true and last tile is 5 circle in 4 5 6 circle chow returns true', () => {
            const winContext = new WinContextBuilder().winByKongOnKongReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_KONG)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('winByFlowerReplacement = true and last tile is 5 circle in 4 5 6 circle chow returns false', () => {
            const winContext = new WinContextBuilder().winByFlowerReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_KONG)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('win by no replacement and last tile is 5 circle in 4 5 6 circle chow returns true', () => {
            const winContext = new WinContextBuilder().build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_KONG)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('winByKongReplacement = true and last tile is 6 circle in 4 5 6 circle chow returns false', () => {
            const winContext = new WinContextBuilder().winByKongReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                            4, SIX_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_KONG)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(true);
        });

        test('winByKongReplacement = true and last tile is 5 circle in 5 6 7 circle chow returns false', () => {
            const winContext = new WinContextBuilder().winByKongReplacement(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE])], 
                            4, FIVE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
                
            const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_KONG)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)?.success).toBe(false);
        });
    });

    test('special hand returns false', () => {
        const winContext = new WinContextBuilder().build();
        const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                        EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                        1, ONE_CIRCLE, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
        
        const result = PLUM_BLOSSOM_ON_ROOF_PREDICATE(specialHand, winContext, basicRoundContext, rootConfig);

        expect(result.pointPredicateId).toBe(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF);
        expect(result.success).toBe(false);
    });
});