import { analyzeForHonorMelds } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/honorMeldsAnalyzer/honorMeldsAnalyzer";
import { analyzeForNonKnittedSuitedMelds } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/nonKnittedSuitedMeldsAnalyzer";
import { ONE_CIRCLE, THREE_BAMBOO, NINE_CHARACTER, WEST_WIND, 
    EAST_WIND, WHITE_DRAGON, SUMMER_SEASON, ORCHID_GENTLEMAN, ONE_BAMBOO, TWO_BAMBOO,
    FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO, PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON, 
    TWO_CIRCLE,
    THREE_CIRCLE,
    FIVE_CIRCLE,
    SIX_CIRCLE,
    SEVEN_CIRCLE,
    RED_DRAGON} from "common/deck";
import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { Pair } from "model/meld/pair";
import { Pong } from "model/meld/pong";
import { Chow } from "model/meld/chow";
import { analyzeForFiveMeldsNoKnitted } from "service/handAnalyzer/base/standardWinningHandAnalyzer/fiveMeldsNoKnittedAnalyzer";
import { Kong } from "model/meld/kong";

jest.mock('service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/honorMeldsAnalyzer/honorMeldsAnalyzer', () => ({
    __esModule: true,
    analyzeForHonorMelds: jest.fn(),
}));

jest.mock('service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/nonKnittedSuitedMeldsAnalyzer', () => ({
    __esModule: true,
    analyzeForNonKnittedSuitedMelds: jest.fn(),
}));
const honorMeldsAnalyzerMock = jest.mocked(analyzeForHonorMelds);
const suitedMeldsAnalyzerMock = jest.mocked(analyzeForNonKnittedSuitedMelds);

describe('fiveMeldsNoKnittedAnalyzer.ts', () => {

    test('hand that does not have userSpecifiedMelds as a subset of the analyzed melds does not produce a winning hand', () => {
        const hand = new Hand([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, true), [new Pong(RED_DRAGON, true)]); // different because of exposed flag
        
        honorMeldsAnalyzerMock.mockReturnValue([[new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, false)]]);
        suitedMeldsAnalyzerMock.mockReturnValue([[new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], false), 
            new Kong(NINE_CHARACTER, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)]]);

        const winningHands = analyzeForFiveMeldsNoKnitted(hand);

        expect(winningHands.length).toBe(0);
    });

    test('hand that does not have analyzed melds that represent all of the tiles does not produce a winning hand', () => {
        const hand = new Hand([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, true), []);
        
        honorMeldsAnalyzerMock.mockReturnValue([[new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, false)]]);
        // one NINE_CHARACTER is not accounted for, Pong instead of Kong via analyzation
        suitedMeldsAnalyzerMock.mockReturnValue([[new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], false), 
            new Pong(NINE_CHARACTER, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)]]);

        const winningHands = analyzeForFiveMeldsNoKnitted(hand);

        expect(winningHands.length).toBe(0);
    });

    test('hand that does not have five analyzed melds where one is a pair does not produce a winning hand', () => {
        const hand = new Hand([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, true), [new Pong(RED_DRAGON, true)]); // different because of exposed flag
        
        honorMeldsAnalyzerMock.mockReturnValue([[new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, false)]]);
        // missing the chow of five six seven circle
        suitedMeldsAnalyzerMock.mockReturnValue([[new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], false), 
            new Kong(NINE_CHARACTER, false)]]);

        const winningHands = analyzeForFiveMeldsNoKnitted(hand);

        expect(winningHands.length).toBe(0);
    });
    
    test('seven pairs hand without userDefinedMelds is not detected.', () => {
        const hand = new Hand([ONE_CIRCLE, ONE_CIRCLE, THREE_BAMBOO, THREE_BAMBOO,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            WEST_WIND, WEST_WIND, EAST_WIND, EAST_WIND,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, true), []);
        
        honorMeldsAnalyzerMock.mockReturnValue([[new Pair(EAST_WIND, false), new Pair(WEST_WIND, false), new Pair(WHITE_DRAGON, false)]]);
        suitedMeldsAnalyzerMock.mockReturnValue([[new Pair(ONE_CIRCLE, false), new Pair(THREE_BAMBOO, false), new Pair(NINE_CHARACTER, false), new Pair(NINE_CHARACTER, false)]]);

        const winningHands = analyzeForFiveMeldsNoKnitted(hand);

        expect(winningHands.length).toBe(0);
    });

    test('a regular five meld hand without userSpecifiedMelds produces a winning hand', () => {
        const hand = new Hand([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, true), []);
        
        honorMeldsAnalyzerMock.mockReturnValue([[new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, false)]]);
        suitedMeldsAnalyzerMock.mockReturnValue([[new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], false), 
            new Kong(NINE_CHARACTER, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)]]);

        const winningHands = analyzeForFiveMeldsNoKnitted(hand);

        expect(winningHands.length).toBe(1);
        const winningHand = winningHands[0];
        expect(winningHand?.melds).toStrictEqual([new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, false),
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], false), 
            new Kong(NINE_CHARACTER, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)]);
        expect(winningHand?.melds[winningHand?.meldWithWinningTileIndex]).toStrictEqual(new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE]));
    });

    test('a regular hand with userSpecifiedMelds as subset of melds produces a winning hand', () => {
        const hand = new Hand([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], true)), 
            [new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], true), new Pong(RED_DRAGON, true)]);
        
        honorMeldsAnalyzerMock.mockReturnValue([[new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, true)]]);
        suitedMeldsAnalyzerMock.mockReturnValue([[new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], true), 
            new Kong(NINE_CHARACTER, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)]]);

        const winningHands = analyzeForFiveMeldsNoKnitted(hand);

        expect(winningHands.length).toBe(1);
        const winningHand = winningHands[0];
        expect(winningHand?.melds).toStrictEqual([new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, true),
            new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], true), 
            new Kong(NINE_CHARACTER, false), new Chow([FIVE_CIRCLE, SIX_CIRCLE, SEVEN_CIRCLE], false)]);
        expect(winningHand?.melds[winningHand?.meldWithWinningTileIndex]).toStrictEqual(new Chow([ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE], true));
    });

    test('if most recent tile context does not specify meld, the tile can be part of different winning melds with the correct exposed flag', () => {
        const hand = new Hand([FIVE_BAMBOO, FIVE_BAMBOO, FIVE_BAMBOO,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO,
            RED_DRAGON, RED_DRAGON, RED_DRAGON,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(FIVE_BAMBOO, false),  // via discard
            []);
        
        honorMeldsAnalyzerMock.mockReturnValue([[new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, false)]]);
        suitedMeldsAnalyzerMock.mockReturnValue([[new Pong(FIVE_BAMBOO, false), new Kong(NINE_CHARACTER, false),
            new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], false)]]);

        const winningHands = analyzeForFiveMeldsNoKnitted(hand);

        expect(winningHands.length).toBe(2);
        const firstWinningHand = winningHands[0];
        expect(firstWinningHand?.melds).toStrictEqual([new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, false),
            new Pong(FIVE_BAMBOO, true),  // the pong exposed flag is set to true, since the winning tile was via discard
            new Kong(NINE_CHARACTER, false), new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], false)]);
        expect(firstWinningHand?.melds[firstWinningHand?.meldWithWinningTileIndex]).toStrictEqual(new Pong(FIVE_BAMBOO, true));

        const secondWinningHand = winningHands[1];
        expect(secondWinningHand?.melds).toStrictEqual([new Pair(WHITE_DRAGON, false), new Pong(RED_DRAGON, false),
            new Pong(FIVE_BAMBOO, false), new Kong(NINE_CHARACTER, false), 
            new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], true)]); // the chow exposed flag is set to true, since the winning tile was via discard
        expect(secondWinningHand?.melds[secondWinningHand?.meldWithWinningTileIndex]).toStrictEqual(new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], true));
    });

    test('shifted melds hand with a pair without userDefinedMelds is detected correctly.', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO,
                    THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO,
                    FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO,
                    ONE_BAMBOO, ONE_BAMBOO,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON], new MostRecentTileContext(SIX_BAMBOO, true), 
                    []);
        
        honorMeldsAnalyzerMock.mockReturnValue([[]]);
        suitedMeldsAnalyzerMock.mockReturnValue([
                    // filtered out because more than one pair
                    [new Pong(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pong(THREE_BAMBOO, false), new Pong(FOUR_BAMBOO, false), new Pair(FIVE_BAMBOO, false)],
                    // filtered out because more than one pair
                    [new Pong(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pong(THREE_BAMBOO, false), new Pair(FOUR_BAMBOO, false), new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], false)],
                    // filtered out because more than one pair
                    [new Pong(ONE_BAMBOO, false), new Pair(TWO_BAMBOO, false), new Pair(THREE_BAMBOO, false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false), new Pair(FOUR_BAMBOO, false)],
                    // filtered out because no pair
                    [new Pong(ONE_BAMBOO, false), new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), 
                        new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false)],
                    // The only complete analyzation that uses all the bamboo tiles
                    [new Pair(ONE_BAMBOO, false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), 
                        new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false),
                        new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], false)]
                    ]);

        const winningHands = analyzeForFiveMeldsNoKnitted(hand);

        expect(winningHands.length).toBe(1);
        const winningHand = winningHands[0];
        expect(winningHand?.melds).toStrictEqual([new Pair(ONE_BAMBOO, false), new Chow([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO], false), 
        new Chow([TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO], false), new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO], false),
        new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO], false)]);
        expect(winningHand?.melds[winningHand?.meldWithWinningTileIndex]).toStrictEqual(new Chow([FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO]));
    });
});