import { Tile } from "model/tile/tile";

export default class PointPredicateResult {
    private _pointPredicateId: string;
    private _success: boolean;
    /** 
     * The tiles that should be shown to the user that add more detail to this result.
     * For example: if success = true, tiles may show all the tiles in the hand that satisfied the predicate.
     * if success = false, tales may contain tiles in the hand that violated the predicate 
     *   OR the tiles present in the hand that violated the predicate.
     * Tile[] is like Meld but undecorated. Since multiple sets of melds Tile[][] could satisfy the predicate,
     * it is wrapped by another array.
     */
    private _tiles: Tile[][][];
    /** 
     * If applicable, the subsets of meld indices in the hand that most satisfy this point predicate.
     * If success = false, the subsets of meld indices may only partially satisfy the predicate.
     *   e.g. if the predicate is about all non-pair melds being chows, but one of the melds is not a chow,
     *   matchedMeldIndicesSubsets only contain the set of indices of the chows.
    */
    private _matchedMeldIndicesSubsets: ReadonlySet<ReadonlySet<number>>;
    private _subPredicateResults: PointPredicateResult[];

    constructor(pointPredicateId: string, 
        success: boolean, 
        tiles: Tile[][][], 
        matchedMeldIndicesSubsets: ReadonlySet<ReadonlySet<number>>,
        subPredicateResults?: PointPredicateResult[]) {
        this._pointPredicateId = pointPredicateId;
        this._success = success;
        this._tiles = tiles;
        this._matchedMeldIndicesSubsets = matchedMeldIndicesSubsets;
        this._subPredicateResults = subPredicateResults ?? [];
    }

    get pointPredicateId(): string {
        return this._pointPredicateId;
    }

    get success(): boolean {
        return this._success;
    }

    get tiles(): Tile[][][] {
        return this._tiles;
    }

    get matchedMeldIndicesSubsets(): ReadonlySet<ReadonlySet<number>> {
        return this._matchedMeldIndicesSubsets;
    }

    get subPredicateResults(): PointPredicateResult[] {
        return this._subPredicateResults;
    }

    static and(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const andPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_&&_" + pointPredicateId))})`;
        for (const result of results) {
            if (!result.success) {
                return new PointPredicateResult(`(${andPointPredicateId})`, false, result.tiles, result._matchedMeldIndicesSubsets, [result]);
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
                return new PointPredicateResult(`(${orPointPredicateId})`, true, result.tiles, result._matchedMeldIndicesSubsets, [result]);
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