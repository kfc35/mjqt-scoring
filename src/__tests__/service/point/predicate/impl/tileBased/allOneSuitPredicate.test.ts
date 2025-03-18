import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pair } from "model/meld/pair";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, EAST_WIND, SIX_CHARACTER, FIVE_CHARACTER, FOUR_CHARACTER, FOUR_BAMBOO, GREEN_DRAGON, NINE_BAMBOO, 
    NINE_CHARACTER, NINE_CIRCLE, NORTH_WIND, ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON,
    SOUTH_WIND, THREE_CHARACTER, TWO_CIRCLE, WEST_WIND, WHITE_DRAGON, FIVE_BAMBOO} from "common/deck";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { Chow } from "model/meld/chow";
import { ALL_ONE_SUIT_PREDICATE } from "service/point/predicate/impl/tileBased/allOneSuitPredicate";

describe('allOneSuitPredicate.ts', () => {
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    test('regular hand with only one suit tiles returns true', () => {
        const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(SIX_CHARACTER), new Pair(NINE_CHARACTER),
            new Pong(FOUR_CHARACTER), new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER])], 
            2, NINE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
        const result = ALL_ONE_SUIT_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(result.pointPredicateId).toBe(PointPredicateID.ALL_ONE_SUIT);
        expect(result.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)?.success).toBe(true);
    });

    test('regular hand with honors and one suit tiles returns false', () => {
        const regularHand = new MeldBasedWinningHand([new Pong(ONE_CHARACTER), new Kong(SIX_CHARACTER), new Pair(EAST_WIND),
            new Pong(NORTH_WIND), new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER])], 
            2, EAST_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
        const result = ALL_ONE_SUIT_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(result.pointPredicateId).toBe(PointPredicateID.ALL_ONE_SUIT);
        expect(result.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)?.success).toBe(true);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)?.success).toBe(false);
        const failure = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS) as PointPredicateFailureResult;
        expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([
            [EAST_WIND, EAST_WIND, NORTH_WIND, NORTH_WIND, NORTH_WIND]
        ]);
    });

    test('regular hand with two suits and no honors returns false', () => {
        const regularHand = new MeldBasedWinningHand([new Pong(ONE_BAMBOO), new Kong(ONE_CIRCLE), new Pair(TWO_CIRCLE),
            new Pong(FIVE_BAMBOO), new Pong(FOUR_BAMBOO)], 
            2, TWO_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
        const result = ALL_ONE_SUIT_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(result.pointPredicateId).toBe(PointPredicateID.ALL_ONE_SUIT);
        expect(result.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)?.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)?.success).toBe(true);
    });

    test('regular hand without suits returns false', () => {
        const regularHand = new MeldBasedWinningHand([new Pong(EAST_WIND), new Kong(SOUTH_WIND), new Pair(NORTH_WIND),
            new Pong(WHITE_DRAGON), new Pong(RED_DRAGON)], 
            2, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
        const result = ALL_ONE_SUIT_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(result.pointPredicateId).toBe(PointPredicateID.ALL_ONE_SUIT);
        expect(result.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)?.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)?.success).toBe(false);
        const failure = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS) as PointPredicateFailureResult;
        expect(failure.tileDetail?.tilesThatFailPredicate).toStrictEqual([
            [EAST_WIND, EAST_WIND, EAST_WIND, SOUTH_WIND, SOUTH_WIND, SOUTH_WIND, SOUTH_WIND, NORTH_WIND, NORTH_WIND],
            [WHITE_DRAGON, WHITE_DRAGON, WHITE_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON]
        ]);
    });

    test('thirteen orphans hand returns false', () => {
        const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
            0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                    
        const result = ALL_ONE_SUIT_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(result.pointPredicateId).toBe(PointPredicateID.ALL_ONE_SUIT);
        expect(result.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_ONE_SUIT)?.success).toBe(false);
        expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)?.success).toBe(false);
    
    });
});