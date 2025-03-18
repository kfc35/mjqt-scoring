import { WinContext } from "model/winContext/winContext";
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
import { ONE_CIRCLE, SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER, THREE_CHARACTER, 
    NORTH_WIND, ONE_CHARACTER, TWO_CHARACTER, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN,
    ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE, EAST_WIND, SOUTH_WIND, WEST_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON
 } from "common/deck";
import { MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE } from "service/point/predicate/impl/winCondition/moonFromBottomOfSeaPredicate";

describe('moonFromBottomOfSeaPredicate.ts', () => {   
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('meld based hand', () => {
        test('win by last tile on wall = true and last tile is one circle returns true', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            1, ONE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_LAST_TILE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE)?.success).toBe(true);
        });

        test('win by last tile on wall = false and last tile is one circle returns false', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(false).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            1, ONE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_LAST_TILE)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE)?.success).toBe(true);
        });

        test('win by last tile on wall = true and last tile is not one circle returns false', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(true).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_LAST_TILE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE)?.success).toBe(false);
        });

        test('win by last tile on wall = false and last tile is not one circle returns false', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(false).build();
            const hand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(ONE_CIRCLE), 
                            new Pong(THREE_CHARACTER), new Pong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
                            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE(hand, winContext, basicRoundContext, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_LAST_TILE)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE)?.success).toBe(false);
        });
    });
    
    describe('special hand', () => {
        test('win by last tile on wall = true and last tile is one circle returns true', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(true).build();
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                            1, ONE_CIRCLE, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
            
            const result = MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE(specialHand, winContext, basicRoundContext, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA);
            expect(result.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_LAST_TILE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE)?.success).toBe(true);
        });
    
        test('win by last tile on wall = false and last tile is one circle returns false', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(false).build();
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                            1, ONE_CIRCLE, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
            
            const result = MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE(specialHand, winContext, basicRoundContext, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_LAST_TILE)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE)?.success).toBe(true);
        });

        test('win by last tile on wall = true and last tile is not one circle returns false', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(true).build();
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                            0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
            
            const result = MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE(specialHand, winContext, basicRoundContext, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_LAST_TILE)?.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE)?.success).toBe(false);
        });

        test('win by last tile on wall = false and last tile is not one circle returns false', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(false).build();
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                            0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
            
            const result = MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE(specialHand, winContext, basicRoundContext, rootConfig);
    
            expect(result.pointPredicateId).toBe(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA);
            expect(result.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.WIN_BY_LAST_TILE)?.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE)?.success).toBe(false);
        });
    });
});