
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";

export default class PointEvaluation {
    private _points: number;
    private _results: PointPredicateResult[];
    private _ignoredPointPredicateIds: Set<string>;

    constructor(points: number, results: PointPredicateResult[], ignoredPointPredicateIds: Set<string>) {
        this._points = points;
        this._results = results;
        this._ignoredPointPredicateIds = ignoredPointPredicateIds;
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
        if (this._points === otherEval.points) {
            return 0;
        }
        return this._points < otherEval.points ? -1 : +1
    }
}