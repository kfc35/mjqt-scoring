import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, NINE_CIRCLE, SOUTH_WIND, EAST_WIND,
    RED_DRAGON, PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON,
    THREE_CHARACTER,
    FOUR_BAMBOO,
    FIVE_BAMBOO,
    SIX_BAMBOO,
    SEVEN_BAMBOO,
    FIVE_CIRCLE,
    SIX_CIRCLE,
    SEVEN_CIRCLE,
    EIGHT_CHARACTER, 
    GREEN_DRAGON,
    WHITE_DRAGON} from "common/deck";
import { analyzeForNonKnittedSuitedMelds } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/nonKnittedSuitedMeldsAnalyzer";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { Pair } from "model/meld/pair";
import { Kong } from "model/meld/kong";

describe('nonKnittedSuitedMeldsAnalyzer.ts', () => {

    test('returns list with empty list when there are no suited tiles', () => {
        const hand = new Hand([WHITE_DRAGON, WHITE_DRAGON, WHITE_DRAGON, 
            GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON, 
            SOUTH_WIND, SOUTH_WIND, SOUTH_WIND,
            RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
            EAST_WIND, EAST_WIND,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(RED_DRAGON, true), []);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists).toStrictEqual([[]]);
    });

    test('returns userSpecifiedMelds over analyzed melds', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, 
            NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
            EAST_WIND, EAST_WIND,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(RED_DRAGON, true), 
            [new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], true), new Kong(THREE_CHARACTER, true), new Pong(NINE_CIRCLE, true)]);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists.length).toBe(1);
        expect(meldLists).toStrictEqual([[new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], true), new Kong(THREE_CHARACTER, true), new Pong(NINE_CIRCLE, true)]]);
    });

    test('returns userSpecifiedMelds over analyzed melds, even if it results in a bad analyzation', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, 
            NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
            EAST_WIND, EAST_WIND,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(RED_DRAGON, true), 
            [new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], true), new Pong(THREE_CHARACTER, true), new Pair(NINE_CIRCLE, true)]);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists.length).toBe(1);
        expect(meldLists).toStrictEqual([[new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], true), new Pong(THREE_CHARACTER, true), new Pair(NINE_CIRCLE, true)]]);
    });

    // this test runs through the complete quantity = 2 logic block
    test('tiles with two identical chows or 3 pairs results in both being analyzed', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE,
            EIGHT_CHARACTER, EIGHT_CHARACTER, EIGHT_CHARACTER,
            EAST_WIND, EAST_WIND,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(EAST_WIND, true), 
            []);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists.length).toBe(2);
        expect(meldLists).toStrictEqual([
            [new Pair(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pair(THREE_BAMBOO, false), new Pong(EIGHT_CHARACTER, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)],
            [new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Pong(EIGHT_CHARACTER, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)]
        ]);
    });

    // this test runs through the complete quantity = 3 logic block
    test('tiles with three sequential pongs or four identical chows results in both being analyzed', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE,
            EAST_WIND, EAST_WIND,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(EAST_WIND, true), 
            []);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists.length).toBe(3);
        expect(meldLists).toStrictEqual([
            [new Pong(ONE_BAMBOO, false), new Pong(TWO_BAMBOO, false), new Pong(THREE_BAMBOO, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)],
            [new Pair(ONE_BAMBOO, false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Pair(TWO_BAMBOO, false), new Pair(THREE_BAMBOO, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)],
            [new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false),
            new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)]
        ]);
    });

    // this test runs through the complete quantity = 4 logic block
    test('tiles with three sequential pongs + chow or four identical chows results in both being analyzed', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            EAST_WIND, EAST_WIND,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(EAST_WIND, true), 
            []);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists.length).toBe(4);
        expect(meldLists).toStrictEqual([
            // this entry is impossible and will be filtered later cause there are no extra tiles to account for the kongs
            [new Kong(ONE_BAMBOO, false), new Kong(TWO_BAMBOO, false), new Kong(THREE_BAMBOO, false)],
            // this entry is possible
            [new Pong(ONE_BAMBOO, false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Pong(TWO_BAMBOO, false), new Pong(THREE_BAMBOO, false)],
            // this entry is impossible since it has more than one pair
            [new Pair(ONE_BAMBOO, false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Pair(TWO_BAMBOO, false), new Pair(THREE_BAMBOO, false)],
            // this entry is possible
            [new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false)]
        ]);
    });

    test('tiles with shifted melds results in correct analyzation', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO,
            THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO,
            FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO,
            EAST_WIND, EAST_WIND,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(EAST_WIND, true), 
            []);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists.length).toBe(1);
        expect(meldLists).toStrictEqual([[new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), 
            new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false),
            new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], false)]
        ]);
    });

    test('tiles with shifted melds and a pair in the beginning tile results in multiple analyzations', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO,
            THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO,
            FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO,
            ONE_BAMBOO, ONE_BAMBOO,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(ONE_BAMBOO, true), 
            []);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists.length).toBe(5);
        expect(meldLists).toStrictEqual([
            // SIX_BAMBOO is left out due to algo
            [new Pong(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pong(THREE_BAMBOO, false), new Pong(FOUR_BAMBOO, false), new Pair(FIVE_BAMBOO, false)],
            // FIVE_BAMBOO is left out due to algo
            [new Pong(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pong(THREE_BAMBOO, false), new Pair(FOUR_BAMBOO, false), new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], false)],
            // FIVE_BAMBOO & SIX_BAMBOO are left out due to algo
            [new Pong(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pair(THREE_BAMBOO, false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false), new Pair(FOUR_BAMBOO, false)],
            // FIVE_BAMBOO & SIX_BAMBOO are left out due to algo
            [new Pong(ONE_BAMBOO, false), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), 
                new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false)],
            // The only complete analyzation that uses all the bamboo tiles
            [new Pair(ONE_BAMBOO, false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), 
                new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false),
                new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], false)]
            ]);
    });

    test('wrong analyzation result does not short circuit out', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO,
            THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO,
            SEVEN_BAMBOO, SEVEN_BAMBOO, SEVEN_BAMBOO,
            ONE_BAMBOO, ONE_BAMBOO,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(ONE_BAMBOO, true), 
            []);

        const meldLists = analyzeForNonKnittedSuitedMelds(hand);

        expect(meldLists.length).toBe(4);
        // the pong of seven bamboo is still included by all meld lists, even the erroneous ones
        expect(meldLists).toStrictEqual([
            // FIVE_BAMBOO is left out due to algo
            [new Pong(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pong(THREE_BAMBOO, false), new Pair(FOUR_BAMBOO, false), new Pong(SEVEN_BAMBOO, false)],
            // one FOUR_BAMBOO is left out due to algo
            [new Pong(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pair(THREE_BAMBOO, false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false), new Pong(SEVEN_BAMBOO, false)],
            // one THREE_BAMBOO & one FIVE_BAMBOO are left out due to algo
            [new Pong(ONE_BAMBOO, false), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), 
                new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), new Pong(SEVEN_BAMBOO, false)],
            // The only complete analyzation that uses all the bamboo tiles
            [new Pair(ONE_BAMBOO, false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), 
                new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false),
                new Pong(SEVEN_BAMBOO, false)]
            ]);
    });

    describe('hand with mix of tiles, one chow in one suit, a pong in another', () => {
        const tiles = [ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
            SOUTH_WIND, SOUTH_WIND, SOUTH_WIND,
            NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
            EAST_WIND, EAST_WIND,
            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON];

        test('without userSpecifiedMelds returns expected analyzed melds default not exposed', () => {
            const hand = new Hand(tiles, new MostRecentTileContext(RED_DRAGON, true));

            const meldLists = analyzeForNonKnittedSuitedMelds(hand);

            expect(meldLists.length).toBe(1);
            expect(meldLists).toStrictEqual([[new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), new Pong(NINE_CIRCLE, false)]]);
        });
    });
});