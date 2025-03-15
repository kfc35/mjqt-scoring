import { defaultRootPointPredicateConfiguration } from "service/point/predicate/configuration/hk/defaultRootPointPredicateConfiguration";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { Hand } from "model/hand/hk/hand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { analyzeHandForWinningHands } from "service/handAnalyzer/hk/handAnalyzer";
import evaluateWinningHand from "service/point/evaluator/hk/pointEvaluator";
import { PointEvaluation } from "model/point/evaluation/pointEvaluation";

export function analyzeForWinningHands(hand: Hand) {
    return analyzeHandForWinningHands(hand);
}

export function evaluateHand(hand: Hand, winCtx: WinContext, roundCtx: RoundContext, rootConfig?: RootPointPredicateConfiguration): PointEvaluation | undefined {
    if (!rootConfig) {
        rootConfig = defaultRootPointPredicateConfiguration;
    }

    const winningHands: WinningHand[] = analyzeHandForWinningHands(hand);
    if (!winningHands) {
        return undefined;
    }

    const pointEvaluations: PointEvaluation[] = winningHands.map(winningHand => evaluateWinningHand(winningHand, winCtx, roundCtx, rootConfig));
    if (!pointEvaluations) {
        return undefined;
    }
    return pointEvaluations.sort()[0];
}

export function evaluateWinningHandForPointEval(winningHand: WinningHand, winCtx: WinContext, roundCtx: RoundContext, rootConfig?: RootPointPredicateConfiguration): PointEvaluation | undefined {
    if (!rootConfig) {
        rootConfig = defaultRootPointPredicateConfiguration;
    }
    
    return evaluateWinningHand(winningHand, winCtx, roundCtx, rootConfig);
}