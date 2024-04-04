import { WinningHand } from "model/hand/hk/winningHand/winningHand"
import { WinContext } from "model/winContext/winContext"
import PointPredicateResult from "service/point/predicate/pointPredicateResult"

export type PointPredicate<T extends WinningHand> = 
    ((winningHand : T, winContext? : WinContext) => PointPredicateResult)

export function predicateAnd<T extends WinningHand>(pointPredicateId?: string, ...pointPredicates :PointPredicate<T>[]) : PointPredicate<T> {
    return (winningHand: T, winContext? : WinContext)  => {
        const results: PointPredicateResult[] = pointPredicates.map(pointPredicate => pointPredicate(winningHand, winContext));
        const newPointPredicateId: string = pointPredicateId ?? `${results.reduce<string>((accum, result) => accum.concat("_&&_" + result.pointPredicateId), "")}`;
        for (const result of results) {
            if (!result.success) {
                return new PointPredicateResult(newPointPredicateId, false, result.matchedTiles, [result]);
            }
        }
        return new PointPredicateResult(newPointPredicateId, true, [], results);
    }
}

export function predicateOr<T extends WinningHand>(pointPredicateId?: string, ...pointPredicates :PointPredicate<T>[]) : PointPredicate<T> {
    return (winningHand: T, winContext? : WinContext)  => {
        const results: PointPredicateResult[] = pointPredicates.map(pointPredicate => pointPredicate(winningHand, winContext));
        const newPointPredicateId: string = pointPredicateId ?? `${results.reduce<string>((accum, result) => accum.concat("_||_" + result.pointPredicateId), "")}`;
        for (const result of results) {
            if (result.success) {
                return new PointPredicateResult(newPointPredicateId, true, result.matchedTiles, [result]);
            }
        }
        return new PointPredicateResult(newPointPredicateId, false, [], results);
    }
}