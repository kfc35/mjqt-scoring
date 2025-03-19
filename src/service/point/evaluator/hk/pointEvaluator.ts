import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { RoundContext } from "model/roundContext/roundContext";
import { WinContext } from "model/winContext/winContext";
import { PointEvaluation } from "model/point/evaluation/pointEvaluation";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { calculateChickenHandResultFromResults } from "service/point/predicate/impl/chicken/chickenHandPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { pointPredicateWiring } from "service/point/predicate/wiring/hk/pointPredicateWiring";
import { addPoints, pointTypeToNumber } from "model/point/configuration/base/pointType";

export function evaluate(winningHand: WinningHand, winCtx: WinContext, roundCtx: RoundContext,
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
        const pointPPR: PointPredicateResult[] = [...pointPredicateIdToResultMap.values()].filter(result => result.success && !pointPredicateIdsToIgnore.has(result.pointPredicateId));
        const points = pointPPR
            .filter(ppr => {
                const baseConfig = rootConfig.getBaseConfiguration(ppr.pointPredicateId);
                if (baseConfig) {
                    return !baseConfig.isBonus;
                }
                return false;
            })
            .map(ppr => rootConfig.getBaseConfiguration(ppr.pointPredicateId)?.points)
            .reduce<number>((accum, pts) => addPoints(accum, pts, rootConfig.maxPoints), 0);

        const bonusPoints = pointPPR
            .filter(ppr => rootConfig.getBaseConfiguration(ppr.pointPredicateId)?.isBonus)
            .map(ppr => rootConfig.getBaseConfiguration(ppr.pointPredicateId)?.points)
            .reduce<number>((accum, pts) => addPoints(accum, pts, rootConfig.maxPoints), 0);

        return new PointEvaluation(winningHand, points, bonusPoints, 
            [...pointPredicateIdToResultMap.values()].sort((a, b) => sortResultsByPointsDescendingIdAlphabetic(a, b, rootConfig)), 
            pointPredicateIdsToIgnore);
}

function getPointPredicatesIdsToIgnoreFromResults(results: PointPredicateResult[], rootPointPredicateConfig: RootPointPredicateConfiguration) : Set<string> {
    const pointPredicateIdsToIgnore: Set<string> = new Set();
    const logicConfig = rootPointPredicateConfig.pointPredicateLogicConfiguration;
    for (const result of results) {
        const baseConfig = rootPointPredicateConfig.getBaseConfiguration(result.pointPredicateId);
        const includedPointPredicates = baseConfig?.generateIncludedPointPredicates(logicConfig);
        if (result.success && !!baseConfig && !!includedPointPredicates && includedPointPredicates.size > 0) {
            includedPointPredicates.forEach(pp => pointPredicateIdsToIgnore.add(pp));
        }
    }
    return pointPredicateIdsToIgnore;
}

function sortResultsByPointsDescendingIdAlphabetic(pprA: PointPredicateResult, pprB: PointPredicateResult, rootConfig: RootPointPredicateConfiguration): number {
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
    if (baseConfigA.points === baseConfigB.points) {
        return pprA.pointPredicateId.localeCompare(pprB.pointPredicateId);
    }
    return pointTypeToNumber(baseConfigA.points, rootConfig.maxPoints) < pointTypeToNumber(baseConfigB.points, rootConfig.maxPoints) ? +1 : -1;
}