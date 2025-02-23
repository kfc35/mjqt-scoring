import { WinningHand } from "model/hand/hk/winningHand/winningHand"
import RoundContext from "model/roundContext/roundContext";
import WinContext from "model/winContext/winContext"
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult"
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";

/** 
 * PointPredicates apply to WinningHands and WinContext. 
 * They are simple statements that evaluate to true or false.
 * One or more "smaller" PointPredicates can be combined to compose a "Faan" or "PointCrierion"
*/
export type PointPredicate<T extends WinningHand> = 
    ((winningHand : T, winCtx : WinContext, roundCtx : RoundContext, config : RootPointPredicateConfiguration) => PointPredicateResult);

// You can combine PointPredicates themselves, or you can combine the results (look at PointPredicateResult class)
export function predicateAnd<T extends WinningHand>(newPointPredicateId?: string, ...pointPredicates :PointPredicate<T>[]) : PointPredicate<T> {
    return (winningHand: T, winContext : WinContext, roundContext : RoundContext, configuration : RootPointPredicateConfiguration)  => {
        const results: PointPredicateResult[] = pointPredicates.map(pointPredicate => pointPredicate(winningHand, winContext, roundContext, configuration));
        const andPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_&&_" + pointPredicateId))})`;
        const sortedResults = [];
        let hasFailure = false;
        for (const result of results) {
            if (!result.success) {
                sortedResults.unshift(result);
                hasFailure = true;
            } else {
                sortedResults.push(result);
            }
        }
        if (hasFailure) {
            return new PointPredicateResult(`(${andPointPredicateId})`, false, sortedResults);
        }
        // the "matching tiles" for the result is more accurately described in the list of results, so we set success and failure tiles to []
        return new PointPredicateResult(`(${andPointPredicateId})`, true, results);
    }
}

export function predicateOr<T extends WinningHand>(newPointPredicateId?: string, ...pointPredicates :PointPredicate<T>[]) : PointPredicate<T> {
    return (winningHand: T, winContext : WinContext, roundContext : RoundContext, configuration : RootPointPredicateConfiguration)  => {
        const results: PointPredicateResult[] = pointPredicates.map(pointPredicate => pointPredicate(winningHand, winContext, roundContext, configuration));
        const orPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_||_" + pointPredicateId))})`;
        const sortedResults = [];
        let hasSuccess = false;
        for (const result of results) {
            if (result.success) {
                sortedResults.unshift(result)
                hasSuccess = true;
            } else {
                sortedResults.push(result);
            }
        }
        if (hasSuccess) {
            return new PointPredicateResult(`(${orPointPredicateId})`, true, sortedResults);
        }
        // the "matching tiles" for the result is more accurately described in the list of results, so we set success and failure tiles to []
        return new PointPredicateResult(`(${orPointPredicateId})`, false, sortedResults);
    }
}