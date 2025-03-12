import { analyzeForHonorMelds } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/honorMeldsAnalyzer/honorMeldsAnalyzer";
import { analyzeForNonKnittedSuitedMelds } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/nonKnittedSuitedMeldsAnalyzer";
import { ONE_CIRCLE, THREE_BAMBOO, NINE_CHARACTER, WEST_WIND, EAST_WIND, WHITE_DRAGON, SUMMER_SEASON, ORCHID_GENTLEMAN } from "common/deck";
import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { Pair } from "model/meld/pair";
import { analyzeForFiveMeldsNoKnitted } from "service/handAnalyzer/base/standardWinningHandAnalyzer/fiveMeldsNoKnittedAnalyzer";

jest.mock('service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/honorMeldsAnalyzer/honorMeldsAnalyzer', () => ({
    __esModule: true,
    analyzeForHonorMelds: jest.fn(),
}));

jest.mock('service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/nonKnittedSuitedMeldsAnalyzer', () => ({
    __esModule: true,
    analyzeForNonKnittedSuitedMelds: jest.fn(),
}));
const honorMeldsAnalyzerMock = jest.mocked(analyzeForHonorMelds);
const suitedMeldsAnalyzerMock = jest.mocked(analyzeForNonKnittedSuitedMelds)

describe('fiveMeldsNoKnittedAnalyzer.ts', () => {
    
    test('seven pairs hand without userDefinedMelds is detected correctly', () => {
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
        expect(honorMeldsAnalyzerMock).toHaveBeenCalled();
        expect(suitedMeldsAnalyzerMock).toHaveBeenCalled();
    });
});