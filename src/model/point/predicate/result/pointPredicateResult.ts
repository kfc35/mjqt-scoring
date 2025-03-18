import { SubPredicateResultsType } from "./pointPredicateSubPredicateResultsType";

export class PointPredicateResult {
    protected _pointPredicateId: string;
    protected _success: boolean;
    protected _subPredicateResultsType: SubPredicateResultsType | undefined;
    protected _idToSubPredicateResult: Map<string, PointPredicateResult>;

    constructor(pointPredicateId: string, 
        success: boolean,
        subPredicateResultsType?: SubPredicateResultsType,
        subPredicateResults?: PointPredicateResult[]) {
        if (pointPredicateId.trim() === "") {
            throw new Error('pointPredicateId cannot be empty / just spaces.');
        }
        this._pointPredicateId = pointPredicateId;
        this._success = success;
        this._idToSubPredicateResult = new Map();
        if (subPredicateResultsType && subPredicateResults) {
            this._subPredicateResultsType = subPredicateResultsType;
            subPredicateResults.map(result => [result.pointPredicateId, result] as [string, PointPredicateResult])
                .forEach(([k, v]) => this._idToSubPredicateResult.set(k, v));
        }
        if (!subPredicateResultsType && !!subPredicateResults && subPredicateResults.length > 0) {
            throw new Error('subPredicateResultsType must be defined if subPredicateResults is a non-empty list');
        }
    }

    get pointPredicateId(): string {
        return this._pointPredicateId;
    }

    get success(): boolean {
        return this._success;
    }

    get subPredicateResultsType() : SubPredicateResultsType | undefined {
        return this._subPredicateResultsType;
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
                return new PointPredicateResult(`${andPointPredicateId}`, false, SubPredicateResultsType.AND, [result, ...otherResults]);
            }
        }
        // all success, results have better detail on success/failure tiles
        return new PointPredicateResult(`${andPointPredicateId}`, true, SubPredicateResultsType.AND,[...results]);
    }

    static or(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const orPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_||_" + pointPredicateId))})`;
        for (const [index, result] of results.entries()) {
            if (result.success) {
                const otherResults = [...results];
                otherResults.splice(index, 1);
                return new PointPredicateResult(`${orPointPredicateId}`, true, SubPredicateResultsType.OR,[result, ... otherResults]);
            }
        }
        return new PointPredicateResult(orPointPredicateId, false, SubPredicateResultsType.OR, [...results]);
    }
}