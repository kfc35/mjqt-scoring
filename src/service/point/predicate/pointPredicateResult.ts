import { Tile } from "model/tile/tile";

export default class PointPredicateResult {
    private _pointPredicateId: string;
    private _success: boolean;
    // the point predicate could apply to multiple meld sets / sets of tile groupings
    // (Tile[] is like Meld)
    private _matchedTiles: Tile[][][];
    private _matchedMeldIndices: ReadonlySet<ReadonlySet<number>>;
    private _subPredicateResults: PointPredicateResult[];

    constructor(pointPredicateId: string, 
        success: boolean, 
        matchedTiles: Tile[][][], 
        matchedMeldIndices: ReadonlySet<ReadonlySet<number>>,
        subPredicateResults?: PointPredicateResult[]) {
        this._pointPredicateId = pointPredicateId;
        this._success = success;
        this._matchedTiles = matchedTiles;
        this._matchedMeldIndices = matchedMeldIndices;
        this._subPredicateResults = subPredicateResults ?? [];
    }

    get pointPredicateId(): string {
        return this._pointPredicateId;
    }

    get success(): boolean {
        return this._success;
    }

    get matchedTiles(): Tile[][][] {
        return this._matchedTiles;
    }

    get matchedMeldIndices(): ReadonlySet<ReadonlySet<number>> {
        return this._matchedMeldIndices;
    }

    get subPredicateResults(): PointPredicateResult[] {
        return this._subPredicateResults;
    }

    static and(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const andPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_&&_" + pointPredicateId))})`;
        for (const result of results) {
            if (!result.success) {
                return new PointPredicateResult(`(${andPointPredicateId})`, false, result.matchedTiles, result.matchedMeldIndices, [result]);
            }
        }
        // all success 
        // the "matching tiles" for the result is more accurately described in the list of results, so we set tiles to []
        return new PointPredicateResult(`(${andPointPredicateId})`, true, [], new Set(), [...results]);
    }

    and(newPointPredicateId?: string, ...otherResults: PointPredicateResult[]) {
        return PointPredicateResult.and(newPointPredicateId, this, ...otherResults);
    }

    static or(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const orPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_||_" + pointPredicateId))})`;
        for (const result of results) {
            if (result.success) {
                return new PointPredicateResult(`(${orPointPredicateId})`, true, result.matchedTiles, result.matchedMeldIndices, [result]);
            }
        }
        // all unsuccessful
        // the "matching tiles" for the result is more accurately described in the list of results, so we set tiles to []
        return new PointPredicateResult(orPointPredicateId, false, [], new Set(), [...results]);
    }

    or(newPointPredicateId?: string, ...otherResults: PointPredicateResult[]) {
        return PointPredicateResult.or(newPointPredicateId, this, ...otherResults);
    }
}