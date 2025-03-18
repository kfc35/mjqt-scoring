
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";

export class PointEvaluation {
    private _winningHand: WinningHand;
    private _points: number;
    private _bonusPoints: number;
    private _pointPredicateResults: PointPredicateResult[];
    private _pointPredicateIdToResultMap: Map<string, PointPredicateResult>;
    private _ignoredPointPredicateIds: Set<string>;

    constructor(winningHand: WinningHand, 
        points: number, 
        bonusPoints: number,
        pointPredicateResults: PointPredicateResult[], 
        ignoredPointPredicateIds: Set<string>) {
        this._winningHand = winningHand;
        this._points = points;
        this._bonusPoints = bonusPoints;
        this._pointPredicateResults = pointPredicateResults;
        this._pointPredicateIdToResultMap = new Map();
        pointPredicateResults.forEach(result => this._pointPredicateIdToResultMap.set(result.pointPredicateId, result));
        this._ignoredPointPredicateIds = ignoredPointPredicateIds;
    }

    get winningHand(): WinningHand {
        return this._winningHand;
    }

    get points(): number {
        return this._points;
    }

    get bonusPoints(): number {
        return this._bonusPoints;
    }

    get results(): ReadonlyArray<PointPredicateResult> {
        return this._pointPredicateResults;
    }

    getResult(pointPredicateId: string): PointPredicateResult | undefined {
        return this._pointPredicateIdToResultMap.get(pointPredicateId);
    }

    get ignoredPointPredicateIds(): ReadonlySet<string> {
        return this._ignoredPointPredicateIds;
    }

    get successUnignoredResults(): PointPredicateResult[] {
        return this.results.filter(result => result.success && !this.ignoredPointPredicateIds.has(result.pointPredicateId));
    }

    get failedUnignoredResults(): PointPredicateResult[] {
        return this.results.filter(result => !result.success && !this.ignoredPointPredicateIds.has(result.pointPredicateId));
    }

    get ignoredResults(): PointPredicateResult[] {
        return this.results.filter(result => this._ignoredPointPredicateIds.has(result.pointPredicateId));
    }

    compareTo(otherEval : PointEvaluation) : number {
        return comparePointEvaluationsByPointsDescending(this, otherEval);
    }
}

function comparePointEvaluationsByPointsDescending(a: PointEvaluation, b: PointEvaluation): number {
    if (a.points === b.points) {
        return 0;
    }
    return a.points < b.points ? +1 : -1
}