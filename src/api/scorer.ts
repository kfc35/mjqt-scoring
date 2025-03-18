import { defaultRootPointPredicateConfiguration } from "service/point/predicate/configuration/hk/defaultRootPointPredicateConfiguration";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { Hand } from "model/hand/hk/hand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { analyzeHandForWinningHands } from "service/handAnalyzer/hk/handAnalyzer";
import { evaluateWinningHand as evalWinningHand } from "service/point/evaluator/hk/pointEvaluator";
import { PointEvaluation } from "model/point/evaluation/pointEvaluation";

export function analyzeForWinningHands(hand: Hand): WinningHand[] {
    return analyzeHandForWinningHands(hand);
}

export function evaluateHandForHighestPointEvaluation(hand: Hand, winCtx: WinContext, roundCtx: RoundContext, rootConfig?: RootPointPredicateConfiguration): PointEvaluation | undefined {
    if (!rootConfig) {
        rootConfig = defaultRootPointPredicateConfiguration;
    }

    const winningHands: WinningHand[] = analyzeHandForWinningHands(hand);
    if (!winningHands || winningHands.length === 0) {
        return undefined;
    }

    const pointEvaluations: PointEvaluation[] = winningHands.map(winningHand => evalWinningHand(winningHand, winCtx, roundCtx, rootConfig));
    return pointEvaluations.sort(sortByPoints)[0];
}

export function evaluateWinningHand(winningHand: WinningHand, winCtx: WinContext, roundCtx: RoundContext, rootConfig?: RootPointPredicateConfiguration): PointEvaluation {
    if (!rootConfig) {
        rootConfig = defaultRootPointPredicateConfiguration;
    }
    
    return evalWinningHand(winningHand, winCtx, roundCtx, rootConfig);
}

function sortByPoints(peA: PointEvaluation, peB: PointEvaluation): number {
    if (!peA) {
        return -1;
    }
    if (!peB) {
        return 1;
    }
    return peA.points < peB.points ? -1 : +1;
}