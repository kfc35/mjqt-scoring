import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pair } from "model/meld/pair";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, EAST_WIND, FIVE_CHARACTER, FOUR_CHARACTER, GREEN_DRAGON, NINE_BAMBOO, 
    NINE_CHARACTER, NINE_CIRCLE, NORTH_WIND, ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON,
    SIX_CHARACTER, SOUTH_WIND, SUITED_TILES, THREE_CHARACTER, WEST_WIND, WHITE_DRAGON } from "common/deck";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { Chow } from "model/meld/chow";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { partitionTilesByGroup } from "common/tileUtils";
import { VOIDED_SUIT_PREDICATE } from "service/point/predicate/impl/tileBased/voidedSuitPredicate";

describe('voidedSuitPredicate.ts', () => {
    const basicWinContext = new WinContextBuilder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    test('regular hand with one suit tiles returns false', () => {
        const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(SIX_CHARACTER), new Pair(EAST_WIND),
            new Pong(NORTH_WIND), new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER])], 
            2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
        const result = VOIDED_SUIT_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
            
        expect(result.pointPredicateId).toBe(PointPredicateID.VOIDED_SUIT);
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
            
            const result = VOIDED_SUIT_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
            
        expect(result.pointPredicateId).toBe(PointPredicateID.VOIDED_SUIT);
        expect(result.success).toBe(true);
        expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
        const success = result as PointPredicateSingleSuccessResult;
        expect(success.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1]));
        expect(success.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([
            [ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO], [ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE]
        ]);
    });
    
    test('regular hand with three suits returns false', () => {
        const regularHand = new MeldBasedWinningHand([new Pong(ONE_BAMBOO), new Kong(ONE_CIRCLE), new Pair(NORTH_WIND),
            new Pong(WHITE_DRAGON), new Pong(THREE_CHARACTER)], 
            2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = VOIDED_SUIT_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
            
        expect(result.pointPredicateId).toBe(PointPredicateID.VOIDED_SUIT);
        expect(result.success).toBe(false);
        expect(result instanceof PointPredicateFailureResult).toBe(true);
        const failure = result as PointPredicateFailureResult;
        expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([
            [ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO], [ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE],
            [THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER]
        ]);
    });
    
    test('regular hand without suits returns false', () => {
        const regularHand = new MeldBasedWinningHand([new Pong(EAST_WIND), new Kong(SOUTH_WIND), new Pair(NORTH_WIND),
            new Pong(WHITE_DRAGON), new Pong(RED_DRAGON)], 
            2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
            
            const result = VOIDED_SUIT_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
            
        expect(result.pointPredicateId).toBe(PointPredicateID.VOIDED_SUIT);
        expect(result.success).toBe(false);
                        
        expect(result instanceof PointPredicateFailureResult).toBe(true);
        const failure = result as PointPredicateFailureResult;
        expect(failure.tileDetail?.tilesThatAreMissingAnyOfToSatisfyPredicate).toStrictEqual(partitionTilesByGroup(SUITED_TILES));
    });
    
    test('thirteen orphans hand returns false', () => {
        const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
            0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                        
            const result = VOIDED_SUIT_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
                        
        expect(result.pointPredicateId).toBe(PointPredicateID.VOIDED_SUIT);
        expect(result.success).toBe(false);
        expect(result instanceof PointPredicateFailureResult).toBe(true);
        const failure = result as PointPredicateFailureResult;
        expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([[ONE_CHARACTER, NINE_CHARACTER], 
            [ONE_BAMBOO, NINE_BAMBOO], [NINE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE]]);
    });
});