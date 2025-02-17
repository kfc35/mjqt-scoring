import { WinningHand } from "model/hand/hk/winningHand/winningHand"
import { RoundContext } from "model/roundContext/roundContext";
import WinContext from "model/winContext/winContext"
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult"
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";

/** 
 * PointPredicates apply to WinningHands and WinContext. 
 * They are simple statements that evaluate to true or false.
 * One or more "smaller" PointPredicates can be combined to compose a "Faan" or "PointCrierion"
*/
export type PointPredicate<T extends WinningHand> = 
    ((winningHand : T, winCtx : WinContext, roundCtx : RoundContext, config : RootPointPredicateConfiguration) => PointPredicateResult);

export function createPointPredicateSwitcher(meldBasedPointPredicate: PointPredicate<MeldBasedWinningHand>, 
    specialPointPredicate: PointPredicate<SpecialWinningHand>): PointPredicate<WinningHand> {
    return (winningHand : WinningHand, winCtx : WinContext, roundCtx : RoundContext, config : RootPointPredicateConfiguration) => {
        if (winningHand instanceof SpecialWinningHand) {
            return specialPointPredicate(winningHand, winCtx, roundCtx, config);
        }
        else if (winningHand instanceof MeldBasedWinningHand) {
            return meldBasedPointPredicate(winningHand, winCtx, roundCtx, config);
        }
        throw new Error('winningHand not instanceOf either implementing class of WinningHand');
    }
}

// You can combine PointPredicates themselves, or you can combine the results (look at PointPredicateResult class)
export function predicateAnd<T extends WinningHand>(newPointPredicateId?: string, ...pointPredicates :PointPredicate<T>[]) : PointPredicate<T> {
    return (winningHand: T, winContext : WinContext, roundContext : RoundContext, configuration : RootPointPredicateConfiguration)  => {
        const results: PointPredicateResult[] = pointPredicates.map(pointPredicate => pointPredicate(winningHand, winContext, roundContext, configuration));
        const andPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_&&_" + pointPredicateId))})`;
        for (const [index, result] of results.entries()) {
            if (!result.success) {
                const otherResults = [...results];
                otherResults.splice(index, 1);
                return new PointPredicateResult(`(${andPointPredicateId})`, false, [result, ...otherResults]);
            }
        }
        // the "matching tiles" for the result is more accurately described in the list of results, so we set success and failure tiles to []
        return new PointPredicateResult(`(${andPointPredicateId})`, true, results);
    }
}

export function predicateOr<T extends WinningHand>(newPointPredicateId?: string, ...pointPredicates :PointPredicate<T>[]) : PointPredicate<T> {
    return (winningHand: T, winContext : WinContext, roundContext : RoundContext, configuration : RootPointPredicateConfiguration)  => {
        const results: PointPredicateResult[] = pointPredicates.map(pointPredicate => pointPredicate(winningHand, winContext, roundContext, configuration));
        const orPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_||_" + pointPredicateId))})`;
        for (const [index, result] of results.entries()) {
            if (result.success) {
                const otherResults = [...results];
                otherResults.splice(index, 1);
                return new PointPredicateResult(`(${orPointPredicateId})`, true, [result, ...otherResults]);
            }
        }
        // the "matching tiles" for the result is more accurately described in the list of results, so we set success and failure tiles to []
        return new PointPredicateResult(`(${orPointPredicateId})`, false, results);
    }
}