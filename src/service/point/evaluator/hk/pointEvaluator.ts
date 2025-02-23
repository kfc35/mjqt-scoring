import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import RoundContext from "model/roundContext/roundContext";
import WinContext from "model/winContext/winContext";
import PointEvaluation from "service/point/evaluator/pointEvaluation";
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";
import { calculateChickenHandResultFromResults } from "service/point/predicate/impl/chicken/chickenHandPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import { pointPredicateWiring } from "service/point/predicate/wiring/hk/pointPredicateWiring";
import { MAX_POINTS, type PointType } from "service/point/predicate/configuration/base/pointPredicateBaseConfiguration";

export default function evaluateWinningHand(winningHand: WinningHand, winCtx: WinContext, roundCtx: RoundContext,
    rootConfig: RootPointPredicateConfiguration): PointEvaluation {
        const pointPredicateIdToResultMap: Map<string, PointPredicateResult> = new Map();

        for (const [pointPredicateId, baseConfig] of rootConfig.pointPredicateIdToBaseConfiguration.entries()) {
            if (baseConfig && baseConfig.enabled) {
                const predicate = pointPredicateWiring.get(pointPredicateId);
                if (predicate) {
                    const result = predicate(winningHand, winCtx, roundCtx, rootConfig);
                    pointPredicateIdToResultMap.set(pointPredicateId, result);
                }
            }
        }

        const chickenHandResult = calculateChickenHandResultFromResults([...pointPredicateIdToResultMap.values()], rootConfig);
        pointPredicateIdToResultMap.set(PointPredicateID.CHICKEN_HAND, chickenHandResult);

        const pointPredicateIdsToIgnore = getPointPredicatesIdsToIgnoreFromResults([...pointPredicateIdToResultMap.values()], rootConfig);
        const pointPPR: PointPredicateResult[] = [...pointPredicateIdToResultMap.values()].filter(result => !pointPredicateIdsToIgnore.has(result.pointPredicateId));
        const points = pointPPR.map(ppr => rootConfig.getBaseConfiguration(ppr.pointPredicateId)?.points).reduce<number>((accum, pts) => addPoints(accum, pts, rootConfig), 0);

        return new PointEvaluation(points, [...pointPredicateIdToResultMap.values()].sort((a, b) => sortByPoints(a, b, rootConfig)), pointPredicateIdsToIgnore);
}

function getPointPredicatesIdsToIgnoreFromResults(results: PointPredicateResult[], rootPointPredicateConfig: RootPointPredicateConfiguration) : Set<string> {
    const pointPredicateIdsToIgnore: Set<string> = new Set();
    for (const result of results) {
        const config = rootPointPredicateConfig.getBaseConfiguration(result.pointPredicateId);
        if (result.success && !!config && !!config.includedPointPredicates && config.includedPointPredicates.size > 0) {
            config.includedPointPredicates.forEach(pp => pointPredicateIdsToIgnore.add(pp));
        }
    }
    return pointPredicateIdsToIgnore;
}

function addPoints(accum: number, pts: PointType | undefined, rootConfig: RootPointPredicateConfiguration): number {
    if (pts === MAX_POINTS) {
        return accum + rootConfig.maxPoints;
    }
    if (!!pts) {
        return accum + pts;
    }
    return accum;
}

function sortByPoints(pprA: PointPredicateResult, pprB: PointPredicateResult, rootConfig: RootPointPredicateConfiguration): number {
    const baseConfigA = rootConfig.getBaseConfiguration(pprA.pointPredicateId);
    const baseConfigB = rootConfig.getBaseConfiguration(pprB.pointPredicateId);
    if (!baseConfigA && !baseConfigB) {
        return 0;
    }
    if (!baseConfigA) {
        return -1;
    }
    if (!baseConfigB) {
        return 1;
    }
    return baseConfigA.points < baseConfigB.points ? -1 : +1;
}