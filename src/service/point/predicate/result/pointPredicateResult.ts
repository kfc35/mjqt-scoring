export default class PointPredicateResult {
    protected _pointPredicateId: string;
    protected _success: boolean;
    protected _subPredicateResults: PointPredicateResult[];

    constructor(pointPredicateId: string, 
        success: boolean, 
        subPredicateResults?: PointPredicateResult[]) {
        this._pointPredicateId = pointPredicateId;
        this._success = success;
        this._subPredicateResults = subPredicateResults ?? [];
    }

    get pointPredicateId(): string {
        return this._pointPredicateId;
    }

    get success(): boolean {
        return this._success;
    }

    get subPredicateResults(): PointPredicateResult[] {
        return this._subPredicateResults;
    }

    static and(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const andPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_&&_" + pointPredicateId))})`;
        for (const [index, result] of results.entries()) {
            if (!result.success) {
                const otherResults = [...results];
                otherResults.splice(index, 1);
                return new PointPredicateResult(`(${andPointPredicateId})`, false, [result, ...otherResults]);
            }
        }
        // all success, results have better detail on success/failure tiles
        return new PointPredicateResult(`(${andPointPredicateId})`, true, [...results]);
    }

    and(newPointPredicateId?: string, ...otherResults: PointPredicateResult[]) {
        return PointPredicateResult.and(newPointPredicateId, this, ...otherResults);
    }

    static or(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const orPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_||_" + pointPredicateId))})`;
        for (const [index, result] of results.entries()) {
            if (result.success) {
                const otherResults = [...results];
                otherResults.splice(index, 1);
                return new PointPredicateResult(`(${orPointPredicateId})`, true, [result, ... otherResults]);
            }
        }
        return new PointPredicateResult(orPointPredicateId, false, [...results]);
    }

    or(newPointPredicateId?: string, ...otherResults: PointPredicateResult[]) {
        return PointPredicateResult.or(newPointPredicateId, this, ...otherResults);
    }
}

export function createPointPredicateSuccessResult(pointPredicateId: string,
    subPredicateResults?: PointPredicateResult[]) {
    return new PointPredicateResult(pointPredicateId, true, subPredicateResults);
}

export function createPointPredicateFailureResult(pointPredicateId: string,
    subPredicateResults?: PointPredicateResult[]) {
    return new PointPredicateResult(pointPredicateId, false, subPredicateResults);
}