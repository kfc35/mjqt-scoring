export class PointPredicateResult {
    protected _pointPredicateId: string;
    protected _success: boolean;
    protected _idToSubPredicateResult: Map<string, PointPredicateResult>;

    constructor(pointPredicateId: string, 
        success: boolean,
        subPredicateResults?: PointPredicateResult[]) {
        if (pointPredicateId.trim() === "") {
            throw new Error('pointPredicateId cannot be empty / just spaces.');
        }
        this._pointPredicateId = pointPredicateId;
        this._success = success;
        this._idToSubPredicateResult = new Map();
        if (subPredicateResults) {
            subPredicateResults.map(result => [result.pointPredicateId, result] as [string, PointPredicateResult])
                .forEach(([k, v]) => this._idToSubPredicateResult.set(k, v));
        }
    }

    get pointPredicateId(): string {
        return this._pointPredicateId;
    }

    get success(): boolean {
        return this._success;
    }

    get subPredicateResults(): PointPredicateResult[] {
        return [...this._idToSubPredicateResult.values()];
    }

    getSubPredicateResult(pointPredicateId: string) {
        return this._idToSubPredicateResult.get(pointPredicateId);
    }

    get idToSubPredicateResult(): ReadonlyMap<string, PointPredicateResult> {
        return this,this._idToSubPredicateResult;
    }

    static and(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const andPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_&&_" + pointPredicateId))})`;
        for (const [index, result] of results.entries()) {
            if (!result.success) {
                const otherResults = [...results];
                otherResults.splice(index, 1);
                return new PointPredicateResult(`${andPointPredicateId}`, false, [result, ...otherResults]);
            }
        }
        // all success, results have better detail on success/failure tiles
        return new PointPredicateResult(`${andPointPredicateId}`, true, [...results]);
    }

    static or(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const orPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_||_" + pointPredicateId))})`;
        for (const [index, result] of results.entries()) {
            if (result.success) {
                const otherResults = [...results];
                otherResults.splice(index, 1);
                return new PointPredicateResult(`${orPointPredicateId}`, true, [result, ... otherResults]);
            }
        }
        return new PointPredicateResult(orPointPredicateId, false, [...results]);
    }
}