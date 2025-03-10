import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { Meld } from "model/meld/meld";
import { Chow } from "model/meld/chow";
import { Kong } from "model/meld/kong";
import { Pair } from "model/meld/pair";
import { ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, NINE_CIRCLE, RED_DRAGON, EAST_WIND, 
    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON, SOUTH_WIND } from "common/deck";
import { analyzeForHonorMelds } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/honorMeldsAnalyzer/honorMeldsAnalyzer";
import { Pong } from "model/meld/pong";

describe('honorMeldsAnalyzer.ts', () => {
    test('hand with four tiles of an honor not in userSpecifiedMeld returns one kong and two pairs', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    TWO_BAMBOO, TWO_BAMBOO, TWO_BAMBOO,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    THREE_BAMBOO, THREE_BAMBOO,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false)),
                [new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false), new Kong(NINE_CIRCLE)]);

        const melds: Meld[][] = analyzeForHonorMelds(hand);
        
        expect(melds.length).toBe(2);
        // two possibilities, one with kong and one with two pairs
        expect(melds).toStrictEqual([[new Kong(RED_DRAGON, false)], [new Pair(RED_DRAGON, false), new Pair(RED_DRAGON, false)]]);
    });

    test('hand with multiple honors not in userSpecifiedMeld returns expected honor melds default not exposed', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    SOUTH_WIND, SOUTH_WIND, SOUTH_WIND,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false)),
                [new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false), new Kong(NINE_CIRCLE)]);

        const melds: Meld[][] = analyzeForHonorMelds(hand);
        
        expect(melds.length).toBe(2);
        // two possibilities, one with kong and one with two pairs
        expect(melds).toStrictEqual(([[new Kong(RED_DRAGON, false), new Pair(EAST_WIND, false), new Pong(SOUTH_WIND, false)],
            [new Pair(RED_DRAGON, false), new Pair(RED_DRAGON, false), new Pair(EAST_WIND, false), new Pong(SOUTH_WIND, false)]]));
    });

    test('hand with honors in userSpecifiedMelds returns userSpecifiedMelds over created unexposed honor melds', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    SOUTH_WIND, SOUTH_WIND, SOUTH_WIND,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(SOUTH_WIND, new Pong(SOUTH_WIND, true)),
                [new Kong(RED_DRAGON, true), new Pong(SOUTH_WIND, true), new Kong(NINE_CIRCLE), new Pair(EAST_WIND, false)]);

        const melds: Meld[][] = analyzeForHonorMelds(hand);
        
        expect(melds).toStrictEqual([[new Kong(RED_DRAGON, true), new Pong(SOUTH_WIND, true), new Pair(EAST_WIND, false)]]);
    });

    test('hand with honors in userSpecifiedMeld that does not use all honor melds returns userSpecifiedMelds only', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    SOUTH_WIND, SOUTH_WIND, SOUTH_WIND,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(SOUTH_WIND, new Pair(SOUTH_WIND, true)),
                [new Pong(RED_DRAGON, false), new Pair(SOUTH_WIND, true), new Kong(NINE_CIRCLE), new Pair(EAST_WIND, false)]);

        const melds: Meld[][] = analyzeForHonorMelds(hand);
        
        // the extra RED_DRAGON tile and SOUTH_WIND tile are not accounted for.
        expect(melds).toStrictEqual([[new Pong(RED_DRAGON, false), new Pair(SOUTH_WIND, true), new Pair(EAST_WIND, false)]]);
    });

    test('seven pair hand with some honors in userSpecifiedMeld returns expected other honors pairs', () => {
        const hand = new Hand([
                    SOUTH_WIND, SOUTH_WIND, SOUTH_WIND, SOUTH_WIND,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND, ONE_BAMBOO, ONE_BAMBOO,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(SOUTH_WIND, new Pair(SOUTH_WIND, true)),
                [new Pair(RED_DRAGON, false), new Pair(SOUTH_WIND, true), new Pair(EAST_WIND, false)]);

        const melds: Meld[][] = analyzeForHonorMelds(hand);
        
        expect(melds.length).toBe(1);
        expect(melds[0]).toStrictEqual(expect.arrayContaining([new Pair(RED_DRAGON, false), new Pair(SOUTH_WIND, true), new Pair(EAST_WIND, false), 
            new Pair(RED_DRAGON, false), new Pair(SOUTH_WIND, false)
        ]));
        expect(melds[0]?.length).toBe(5);
    });
});