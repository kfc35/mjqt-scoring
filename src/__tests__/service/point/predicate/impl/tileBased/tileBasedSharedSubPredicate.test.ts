import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pair } from "model/meld/pair";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, EAST_WIND, FIVE_CHARACTER, FOUR_BAMBOO, FOUR_CHARACTER, GREEN_DRAGON, HONOR_TILES, NINE_BAMBOO, 
    NINE_CHARACTER, NINE_CIRCLE, NORTH_WIND, ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON,
    SIX_CHARACTER,
    SOUTH_WIND, SUITED_TILES, THREE_BAMBOO, THREE_CHARACTER, TWO_BAMBOO, WEST_WIND, WHITE_DRAGON } from "common/deck";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { Chow } from "model/meld/chow";
import { handContainsHonorsSubPredicate, handContainsMoreThanOneSuitSubPredicate, handContainsOneSuitSubPredicate } from "service/point/predicate/impl/tileBased/tileBasedSharedSubPredicate";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { partitionTilesByGroup } from "common/tileUtils";

describe('tileBasedSharedSubPredicate.ts', () => {
    describe('handContainsHonorsSubPredicate', () => {
        test('regular hand with honors and suited tiles returns true', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pong(NORTH_WIND), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO])], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsHonorsSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS);
            expect(result.success).toBe(true);
                    
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([3]));
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[NORTH_WIND, NORTH_WIND, NORTH_WIND]]);
        });

        test('regular hand without honors returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(NINE_BAMBOO), new Pair(NINE_CIRCLE),
                new Pong(THREE_CHARACTER), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO])], 
                2, NINE_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsHonorsSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS);
            expect(result.success).toBe(false);
                    
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(HONOR_TILES));
        });

        test('thirteen orphans hand returns true', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                    
            const result = handContainsHonorsSubPredicate(specialHand);
                    
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_HONORS);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail).toBeUndefined();
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND], [RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON]]);
        });
    });

    describe('handContainsOneSuitSubPredicate', () => {
        test('regular hand with honors and one suit tiles returns true', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(SIX_CHARACTER), new Pair(EAST_WIND),
                new Pong(NORTH_WIND), new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER])], 
                2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsOneSuitSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT);
            expect(result.success).toBe(true);
                    
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 4]));
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER, SIX_CHARACTER, SIX_CHARACTER, SIX_CHARACTER, SIX_CHARACTER, 
                    THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER]
            ]);
        });

        test('regular hand with more than one suit returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_BAMBOO), new Kong(ONE_CIRCLE), new Pair(NORTH_WIND),
                new Pong(WHITE_DRAGON), new Pong(RED_DRAGON)], 
                2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsOneSuitSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT);
            expect(result.success).toBe(false);
                    
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO], 
                [ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE]]);
        });

        test('regular hand without suits returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(EAST_WIND), new Kong(SOUTH_WIND), new Pair(NORTH_WIND),
                new Pong(WHITE_DRAGON), new Pong(RED_DRAGON)], 
                2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsOneSuitSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT);
            expect(result.success).toBe(false);
                    
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(SUITED_TILES));
        });

        test('thirteen orphans hand returns false', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                    
            const result = handContainsOneSuitSubPredicate(specialHand);
                    
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT);
            expect(result.success).toBe(false);
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([[ONE_CHARACTER, NINE_CHARACTER], 
                [ONE_BAMBOO, NINE_BAMBOO], [NINE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE]]);
        });
    });

    describe('handContainsMoreThanOneSuitSubPredicate', () => {
        test('regular hand with one suit tiles returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(SIX_CHARACTER), new Pair(EAST_WIND),
                new Pong(NORTH_WIND), new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER])], 
                2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsMoreThanOneSuitSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT);
            expect(result.success).toBe(false);   
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([[ONE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER, 
                SIX_CHARACTER, SIX_CHARACTER, SIX_CHARACTER, SIX_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER]]);
        });

        test('regular hand with two suits returns true', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_BAMBOO), new Kong(ONE_CIRCLE), new Pair(NORTH_WIND),
                new Pong(WHITE_DRAGON), new Pong(RED_DRAGON)], 
                2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsMoreThanOneSuitSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1]));
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO], [ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE]
            ]);
        });

        test('regular hand with three suits returns true', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(ONE_BAMBOO), new Kong(ONE_CIRCLE), new Pair(NORTH_WIND),
                new Pong(WHITE_DRAGON), new Pong(THREE_CHARACTER)], 
                2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsMoreThanOneSuitSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const success = result as PointPredicateSingleSuccessResult;
            expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 4]));
            expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
                [ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO], [ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE],
                [THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER]
            ]);
        });

        test('regular hand without suits returns false', () => {
            const regularHand = new MeldBasedWinningHand([new Pong(EAST_WIND), new Kong(SOUTH_WIND), new Pair(NORTH_WIND),
                new Pong(WHITE_DRAGON), new Pong(RED_DRAGON)], 
                2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
            const result = handContainsMoreThanOneSuitSubPredicate(regularHand);
        
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT);
            expect(result.success).toBe(false);
                    
            expect(result instanceof PointPredicateFailureResult).toBe(true);
            const failure = result as PointPredicateFailureResult;
            expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(SUITED_TILES));
        });

        test('thirteen orphans hand returns true', () => {
            const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                    
            const result = handContainsMoreThanOneSuitSubPredicate(specialHand);
                    
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT);
            expect(result.success).toBe(true);
            expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
            const failure = result as PointPredicateSingleSuccessResult;
            expect(failure.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[ONE_CHARACTER, NINE_CHARACTER], 
                [ONE_BAMBOO, NINE_BAMBOO], [NINE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE]]);
        });
    });
});