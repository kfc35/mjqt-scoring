import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pong } from "model/meld/pong";
import { Pair } from "model/meld/pair";
import { Kong } from "model/meld/kong";
import { Chow } from "model/meld/chow";
import { FIVE_CHARACTER, TWO_CHARACTER, EIGHT_CHARACTER, SEVEN_CHARACTER, EIGHT_CIRCLE,
    THREE_CIRCLE, THREE_CHARACTER, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN,
    ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, ONE_CIRCLE, NINE_CIRCLE, 
    EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, WHITE_DRAGON, GREEN_DRAGON
 } from "common/deck";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { THIRTEEN_ORPHANS_PREDICATE } from "service/point/predicate/impl/hand/thirteenOrphansPredicate";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";

describe('thirteenOrphansPredicate.ts', () => {
    const basicWinContext = new WinContextBuilder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    test('thirteen orphans hand returns true', () => {
        const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
            0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
    
        const result = THIRTEEN_ORPHANS_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
    
        expect(result.pointPredicateId).toBe(PointPredicateID.THIRTEEN_ORPHANS);
        expect(result.success).toBe(true);
        expect(result instanceof PointPredicateSingleSuccessResult).toBe(true);
    });

    test('other special hand returns false', () => {
        const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
            0, EAST_WIND, false, false, [], SpecialWinningHandType.CUSTOM);
    
        const result = THIRTEEN_ORPHANS_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
    
        expect(result.pointPredicateId).toBe(PointPredicateID.THIRTEEN_ORPHANS);
        expect(result.success).toBe(false);
    });

    test('regular melded hand returns false', () => {
        const regularHand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER], true), new Pair(EIGHT_CIRCLE), 
            new Kong(THREE_CIRCLE), new Pong(NORTH_WIND, true), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER])], 
            3, NORTH_WIND, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
    
        const result = THIRTEEN_ORPHANS_PREDICATE(regularHand, basicWinContext, basicRoundContext, rootConfig);
    
        expect(result.pointPredicateId).toBe(PointPredicateID.THIRTEEN_ORPHANS);
        expect(result.success).toBe(false);
    });

    test('seven pairs hand returns false', () => {
        const sevenPairs = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER, true),
            new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(FIVE_CHARACTER)], 
            2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
    
        const result = THIRTEEN_ORPHANS_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);
    
        expect(result.pointPredicateId).toBe(PointPredicateID.THIRTEEN_ORPHANS);
        expect(result.success).toBe(false);
    });
});