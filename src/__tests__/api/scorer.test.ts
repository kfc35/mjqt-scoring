import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { WinContextBuilder } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { Hand } from "model/hand/hk/hand";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointEvaluation } from "model/point/evaluation/pointEvaluation";
import { analyzeForWinningHands, evaluateHandForHighestPossiblePointEvaluation, evaluateWinningHand } from "api/scorer";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { ONE_BAMBOO } from "common/deck";
import { Pair } from "model/meld/pair";
import { evaluate } from "service/point/evaluator/hk/pointEvaluator";
import { analyzeHandForWinningHands } from "service/handAnalyzer/hk/handAnalyzer";
import { Pong } from "model/meld/pong";

jest.mock('model/hand/hk/hand', () => {
    return {
        Hand: jest.fn().mockImplementation(() => {
            return {
                isSelfDrawn(): boolean {
                    return false;
                },
            }
        })
    };
});

jest.mock('model/hand/hk/winningHand/meldBasedWinningHand', () => {
    return {
        MeldBasedWinningHand: jest.fn().mockImplementation(() => {
            return {
                isSelfDrawn(): boolean {
                    return false;
                },
            }
        })
    };
});

jest.mock('model/point/evaluation/pointEvaluation', () => {
    return {
        PointEvaluation: jest.fn().mockImplementation((_, points: number) => {
            return {
                get points(): number {
                    return points;
                },
            }
        })
    };
});

jest.mock('service/handAnalyzer/hk/handAnalyzer', () => ({
    __esModule: true,
    analyzeHandForWinningHands: jest.fn(),
}));
jest.mock('service/point/evaluator/hk/pointEvaluator', () => ({
    __esModule: true,
    evaluate: jest.fn(),
}));
const analyzeHandForWinningHandsMock = jest.mocked(analyzeHandForWinningHands);
const evaluateMock = jest.mocked(evaluate);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('scorer.ts', () => {
    const winContext = new WinContextBuilder().build();
    const roundContext = new RoundContext(WindDirection.EAST, WindDirection.SOUTH);
    const rootConfig = new RootPointPredicateConfiguration(13);

    const mockHand = new Hand([], new MostRecentTileContext(ONE_BAMBOO, true));

    const mockWinningHand = new MeldBasedWinningHand([new Pair(ONE_BAMBOO)], 0, ONE_BAMBOO, []);
    const mockWinningHandTwo = new MeldBasedWinningHand([new Pong(ONE_BAMBOO)], 0, ONE_BAMBOO, []);
    const mockPointEvalOne = new PointEvaluation(mockWinningHand, 1, 0, [], new Set());
    const mockPointEvalTwo = new PointEvaluation(mockWinningHand, 2, 0, [], new Set());

    test('evaluateHandForHighestPossiblePointEvaluation without any possible winning hands returns undefined', () => {
        analyzeHandForWinningHandsMock.mockReturnValue([]);
        evaluateMock.mockReturnValue(mockPointEvalOne);

        const evaluation = evaluateHandForHighestPossiblePointEvaluation(mockHand, winContext, roundContext, rootConfig);

        expect(analyzeHandForWinningHandsMock).toHaveBeenCalledWith(mockHand);
        expect(evaluation).toBeUndefined();
        expect(evaluateMock).toHaveBeenCalledTimes(0);
    });

    test('evaluateHandForHighestPossiblePointEvaluation without any possible winning hands returns undefined', () => {
        analyzeHandForWinningHandsMock.mockReturnValue([mockWinningHand, mockWinningHandTwo]);
        evaluateMock.mockReturnValueOnce(mockPointEvalOne).mockReturnValueOnce(mockPointEvalTwo);

        const evaluation = evaluateHandForHighestPossiblePointEvaluation(mockHand, winContext, roundContext, rootConfig);

        expect(analyzeHandForWinningHandsMock).toHaveBeenCalledWith(mockHand);
        expect(evaluation).toBe(mockPointEvalTwo);
        expect(evaluateMock).toHaveBeenCalledTimes(2);
        expect(evaluateMock).toHaveBeenNthCalledWith(1, mockWinningHand, winContext, roundContext, rootConfig);
        expect(evaluateMock).toHaveBeenNthCalledWith(2, mockWinningHandTwo, winContext, roundContext, rootConfig);
    });

    test('analyzeForWinningHands delegates correctly', () => {
        analyzeHandForWinningHandsMock.mockReturnValue([mockWinningHand]);

        const winningHands = analyzeForWinningHands(mockHand);

        expect(analyzeHandForWinningHandsMock).toHaveBeenCalledWith(mockHand);
        expect(winningHands).toStrictEqual([mockWinningHand]);
    });

    test('evaluateWinningHand delegates correctly', () => {
        evaluateMock.mockReturnValue(mockPointEvalOne);

        const pointEval = evaluateWinningHand(mockWinningHand, winContext, roundContext, rootConfig);

        expect(evaluateMock).toHaveBeenCalledWith(mockWinningHand, winContext, roundContext, rootConfig);
        expect(pointEval).toBe(mockPointEvalOne);
    });
});
