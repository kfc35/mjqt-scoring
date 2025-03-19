import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pair } from "model/meld/pair";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { SEVEN_CHARACTER, EIGHT_CIRCLE, THREE_BAMBOO, FIVE_CHARACTER, THREE_CHARACTER, 
    AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN, ONE_BAMBOO, NINE_BAMBOO,
    ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE, EAST_WIND, SOUTH_WIND,
    WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON, TWO_CIRCLE, 
    THREE_CIRCLE, FOUR_CIRCLE, SEVEN_CIRCLE, SUMMER_SEASON, TWO_CHARACTER, FOUR_CHARACTER} from "common/deck";
import { evaluate } from "service/point/evaluator/hk/pointEvaluator";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { defaultRootPointPredicateConfiguration } from "service/point/predicate/configuration/hk/defaultRootPointPredicateConfiguration";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { pointTypeToNumber } from "model/point/configuration/base/pointType";
import { Chow } from "model/meld/chow";

describe('pointEvaluator.ts', () => {
    const winContext = new WinContext.Builder().build();
    const roundContext = new RoundContext(WindDirection.EAST, WindDirection.SOUTH);
    let rootConfig = defaultRootPointPredicateConfiguration.clone();

    beforeEach(() => {
        rootConfig = defaultRootPointPredicateConfiguration.clone();
    });

    test('all pong kong hand gets correct evaluation', () => {
        const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                        new Pair(EIGHT_CIRCLE), new Kong(THREE_BAMBOO), new Kong(FIVE_CHARACTER, true), 
                        new Pong(THREE_CHARACTER)], 
                        0, SEVEN_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);
        
        const pointEval = evaluate(hand, winContext, roundContext, rootConfig);

        // all simples is disabled
        const expectedPoints = pointTypeToNumber(rootConfig.getBaseConfiguration(PointPredicateID.ALL_PONGS_AND_KONGS)?.points, rootConfig.maxPoints);
        expect(pointEval.points).toBe(expectedPoints);
        expect(pointEval.successUnignoredResults.length).toBe(1);
        expect(pointEval.successUnignoredResults[0]?.pointPredicateId).toStrictEqual(PointPredicateID.ALL_PONGS_AND_KONGS);
        expect(pointEval.successUnignoredResults[0]?.success).toBe(true);
        expect(pointEval.ignoredResults.length).toBe(0);
    });

    test('all one suit and honors dragon pong self drawn seat season gets correct evaluation', () => {
        const hand = new MeldBasedWinningHand([new Pong(GREEN_DRAGON, true), 
                        new Pair(EIGHT_CIRCLE), new Chow([TWO_CIRCLE, THREE_CIRCLE, FOUR_CIRCLE]), new Kong(SEVEN_CIRCLE, true), 
                        new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE])], 
                        2, TWO_CIRCLE, [SUMMER_SEASON]);
        
        const pointEval = evaluate(hand, winContext, roundContext, rootConfig);

        const expectedPoints = pointTypeToNumber(rootConfig.getBaseConfiguration(PointPredicateID.ALL_ONE_SUIT_AND_HONORS)?.points, rootConfig.maxPoints)
            + pointTypeToNumber(rootConfig.getBaseConfiguration(PointPredicateID.SELF_DRAW)?.points, rootConfig.maxPoints)
            + pointTypeToNumber(rootConfig.getBaseConfiguration(PointPredicateID.SEAT_SEASON)?.points, rootConfig.maxPoints)
            + pointTypeToNumber(rootConfig.getBaseConfiguration(PointPredicateID.GREEN_DRAGON_PONG_KONG)?.points, rootConfig.maxPoints)
        expect(pointEval.points).toBe(expectedPoints);
        expect(pointEval.successUnignoredResults.length).toBe(4);
        expect(pointEval.successUnignoredResults[0]?.pointPredicateId).toStrictEqual(PointPredicateID.ALL_ONE_SUIT_AND_HONORS);
        expect(pointEval.successUnignoredResults[0]?.success).toBe(true);
        expect(pointEval.successUnignoredResults[1]?.pointPredicateId).toStrictEqual(PointPredicateID.GREEN_DRAGON_PONG_KONG);
        expect(pointEval.successUnignoredResults[1]?.success).toBe(true);
        expect(pointEval.successUnignoredResults[2]?.pointPredicateId).toStrictEqual(PointPredicateID.SEAT_SEASON);
        expect(pointEval.successUnignoredResults[2]?.success).toBe(true);
        expect(pointEval.successUnignoredResults[3]?.pointPredicateId).toStrictEqual(PointPredicateID.SELF_DRAW);
        expect(pointEval.successUnignoredResults[3]?.success).toBe(true);
        expect(pointEval.ignoredResults.length).toBe(0);
    });

    test('thirteen orphans no flowers gets correct evaluation', () => {
        const hand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                    EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                    0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
        
        const pointEval = evaluate(hand, winContext, roundContext, rootConfig);

        const expectedPoints = pointTypeToNumber(rootConfig.getBaseConfiguration(PointPredicateID.THIRTEEN_ORPHANS)?.points, rootConfig.maxPoints)
            + pointTypeToNumber(rootConfig.getBaseConfiguration(PointPredicateID.NO_GENTLEMEN_OR_SEASONS)?.points, rootConfig.maxPoints);
        expect(pointEval.points).toBe(expectedPoints);
        expect(pointEval.successUnignoredResults.length).toBe(2);
        expect(pointEval.successUnignoredResults[0]?.pointPredicateId).toStrictEqual(PointPredicateID.THIRTEEN_ORPHANS);
        expect(pointEval.successUnignoredResults[0]?.success).toBe(true);
        expect(pointEval.successUnignoredResults[1]?.pointPredicateId).toStrictEqual(PointPredicateID.NO_GENTLEMEN_OR_SEASONS);
        expect(pointEval.successUnignoredResults[1]?.success).toBe(true);
        expect(pointEval.ignoredResults.length).toBe(2);
        expect(pointEval.ignoredResults[0]?.pointPredicateId).toStrictEqual(PointPredicateID.ALL_HONORS_AND_TERMINALS);
        expect(pointEval.ignoredResults[0]?.success).toBe(true);
        expect(pointEval.ignoredResults[1]?.pointPredicateId).toStrictEqual(PointPredicateID.CONCEALED_HAND);
        expect(pointEval.ignoredResults[1]?.success).toBe(true);
    });

    test('chicken hand gets correct evaluation', () => {
        const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER, true), 
                        new Pair(RED_DRAGON), new Pong(THREE_BAMBOO), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), 
                        new Pong(FOUR_CHARACTER)], 
                        0, SEVEN_CHARACTER, [AUTUMN_SEASON]);
        
        const pointEval = evaluate(hand, winContext, roundContext, rootConfig);

        const expectedPoints = 0;
        expect(pointEval.points).toBe(expectedPoints);
        expect(pointEval.successUnignoredResults.length).toBe(1);
        expect(pointEval.successUnignoredResults[0]?.pointPredicateId).toStrictEqual(PointPredicateID.CHICKEN_HAND);
        expect(pointEval.successUnignoredResults[0]?.success).toBe(true);
        expect(pointEval.ignoredResults.length).toBe(0);
    });
});