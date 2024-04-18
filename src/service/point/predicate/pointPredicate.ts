import { WinningHand } from "model/hand/hk/winningHand/winningHand"
import { WinContext } from "model/winContext/winContext"
import PointPredicateResult from "service/point/predicate/pointPredicateResult"

/** 
 * PointPredicates apply to WinningHands and WinContext. 
 * They are simply statements that evaluate to true or false.
 * One or more "smaller" PointPredicates can be combined to compose a "Faan" or "PointCrierion"
*/
export type PointPredicate<T extends WinningHand> = 
    ((winningHand : T, winContext? : WinContext) => PointPredicateResult)

// You can combine PointPredicates themselves, or you can combine the results (look at PointPredicateResult class)
export function predicateAnd<T extends WinningHand>(newPointPredicateId?: string, ...pointPredicates :PointPredicate<T>[]) : PointPredicate<T> {
    return (winningHand: T, winContext? : WinContext)  => {
        const results: PointPredicateResult[] = pointPredicates.map(pointPredicate => pointPredicate(winningHand, winContext));
        const andPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_&&_" + pointPredicateId))})`;
        for (const result of results) {
            if (!result.success) {
                return new PointPredicateResult(`(${andPointPredicateId})`, false, result.matchedTiles, result.matchedMeldIndices, [result]);
            }
        }
        // the "matching tiles" for the result is more accurately described in the list of results, so we set tiles to []
        return new PointPredicateResult(`(${andPointPredicateId})`, true, [], new Set(), results);
    }
}

export function predicateOr<T extends WinningHand>(newPointPredicateId?: string, ...pointPredicates :PointPredicate<T>[]) : PointPredicate<T> {
    return (winningHand: T, winContext? : WinContext)  => {
        const results: PointPredicateResult[] = pointPredicates.map(pointPredicate => pointPredicate(winningHand, winContext));
        const orPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_||_" + pointPredicateId))})`;
        for (const result of results) {
            if (result.success) {
                return new PointPredicateResult(`(${orPointPredicateId})`, true, result.matchedTiles, result.matchedMeldIndices, [result]);
            }
        }
        // the "matching tiles" for the result is more accurately described in the list of results, so we set tiles to []
        return new PointPredicateResult(`(${orPointPredicateId})`, false, [], new Set(), results);
    }
}