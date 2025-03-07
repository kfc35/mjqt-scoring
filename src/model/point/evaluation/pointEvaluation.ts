
import type { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";

export class PointEvaluation {
    private _winningHand: WinningHand;
    private _points: number;
    private _results: PointPredicateResult[];
    private _ignoredPointPredicateIds: Set<string>;

    constructor(winningHand: WinningHand, points: number, results: PointPredicateResult[], ignoredPointPredicateIds: Set<string>) {
        this._winningHand = winningHand;
        this._points = points;
        this._results = results;
        this._ignoredPointPredicateIds = ignoredPointPredicateIds;
    }

    get winningHand(): WinningHand {
        return this._winningHand;
    }

    get points(): number {
        return this._points;
    }

    get results(): PointPredicateResult[] {
        return this._results;
    }

    get successResults(): PointPredicateResult[] {
        return this._results.filter(result => result.success);
    }

    get failedResults(): PointPredicateResult[] {
        return this._results.filter(result => !result.success);
    }

    get ignoredPointPredicateIds(): Set<string> {
        return this._ignoredPointPredicateIds;
    }

    get ignoredResults(): PointPredicateResult[] {
        return this._results.filter(result => this._ignoredPointPredicateIds.has(result.pointPredicateId));
    }

    compareTo(otherEval : PointEvaluation) : number {
        return comparePointEvaluations(this, otherEval);
    }
}

function comparePointEvaluations(a: PointEvaluation, b: PointEvaluation): number {
    if (a.points === b.points) {
        return 0;
    }
    return a.points < b.points ? -1 : +1
}