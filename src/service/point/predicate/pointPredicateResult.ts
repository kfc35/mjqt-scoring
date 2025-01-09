import { Tile } from "model/tile/tile";

export enum PointPredicateResultCode {
    SUCCESS = 'SUCCESS',
    IGNORED_NON_REPEAT_PRINCIPLE = 'IGNORED_NON_REPEAT_PRINCIPLE', // included by another result
    IGNORED_NON_IDENTICAL_PRINCIPLE = 'IGNORED_NON_IDENTICAL_PRINCIPLE',
    IGNORED_EXCLUSIONARY_PRINCIPLE = 'IGNORED_EXCLUSIONARY_PRINCIPLE',
    IGNORED_CONDITION_NOT_APPLICABLE = 'IGNORED_CONDITION_NOT_APPLICABLE', // the "if" part of "if...then predicate " is false.
    FAILURE = 'FAILURE',
    FAILURE_IGNORED = 'FAILURE_IGNORED',
}

// PointPredicateSuccessResult, PointPredicateSuccessIgnoredResult, PointPredicateFailureResult
// DISABLED just doesnt show up as a result
// predicates can return a list of results. that list can be empty if disabled. can have multiple success results if multiple subsets count.

export default class PointPredicateResult {
    private _pointPredicateId: string;
    private _success: boolean;
    private _ignored: boolean; // TODO the reason it was ignored?
    /** 
     * if success = true, successTiles contains all the tiles in the hand that satisfied the predicate.
     * if success = false, successTiles contains tiles in the hand that partially satisfied the predicate.
     * Since multiple groupings of melds in the hand (Tile[][]) could satisfy the predicate, it is wrapped by another array. 
     * i.e. a hand with two distinct short straights could have [[[1B,2B,3B],[4B,5B,6B]],[[2C,3C,4C],[5C,6C,7C]]]
     * This field works for both Standard and Special winning hands.
     */
    private _successTiles: Tile[][][];
    /**
     * If _failureTiles is non-empty, _failureTiles contains the tiles that violate the predicate because they exist in the hand.
     * It is not wrapped in another [] because a violation of a predicate applies across the whole hand, no matter how it is arranged.
     */
    private _failureTiles: Tile[][];

    // If _missingTiles is non-empty, _missingTiles contains tiles the hand lacks to pass the given predicate.
    private _missingTiles: Tile[][];
    /** 
     * If success = true, the subsets of meld indices in the hand that satisfy this point predicate.
     * If success = false, the subsets of meld indices that only partially satisfy the predicate.
     *   e.g. if the predicate is about all non-pair melds being chows, but one of the melds is not a chow,
     *   matchedMeldIndicesSubsets only contain the set of indices of the chows.
     * This only matters for StandardWinningHands, and is used for correct calculation in International rules.
     * Special winning hands will return an empty set.
     * _successTiles is derived from these subsets for StandardWinningHands.
    */
    private _matchedMeldIndicesSubsets: ReadonlySet<ReadonlySet<number>>;
    //private _failureMeldIndices: ReadonlySet<number>;
    private _subPredicateResults: PointPredicateResult[];

    constructor(pointPredicateId: string, 
        success: boolean, 
        successTiles: Tile[][][], 
        failureTiles: Tile[][], 
        missingTiles: Tile[][],
        matchedMeldIndicesSubsets: ReadonlySet<ReadonlySet<number>>,
        //failureMeldIndices: ReadonlySet<number>,
        subPredicateResults?: PointPredicateResult[]) {
        this._pointPredicateId = pointPredicateId;
        this._success = success;
        this._ignored = false;
        this._successTiles = successTiles;
        this._failureTiles = failureTiles;
        this._missingTiles = missingTiles;
        this._matchedMeldIndicesSubsets = matchedMeldIndicesSubsets;
        //this._failureMeldIndices = failureMeldIndices;
        this._subPredicateResults = subPredicateResults ?? [];
    }

    get pointPredicateId(): string {
        return this._pointPredicateId;
    }

    get success(): boolean {
        return this._success;
    }

    get ignored(): boolean {
        return this._ignored;
    }

    set ignored(ignored: boolean) {
        this._ignored = ignored;
    }

    get successTiles(): Tile[][][] {
        return this._successTiles;
    }

    get failureTiles(): Tile[][] {
        return this._failureTiles;
    }

    get missingTiles(): Tile[][] {
        return this._missingTiles;
    }

    get matchedMeldIndicesSubsets(): ReadonlySet<ReadonlySet<number>> {
        return this._matchedMeldIndicesSubsets;
    }

    get failureMeldIndicesSubsets(): ReadonlySet<ReadonlySet<number>> {
        return this._matchedMeldIndicesSubsets;
    }

    get subPredicateResults(): PointPredicateResult[] {
        return this._subPredicateResults;
    }

    static and(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const andPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_&&_" + pointPredicateId))})`;
        for (const result of results) {
            if (!result.success) {
                return new PointPredicateResult(`(${andPointPredicateId})`, false, result.successTiles, result._failureTiles, result._missingTiles, result._matchedMeldIndicesSubsets, [result]);
            }
        }
        // all success, results have better detail on success/failure tiles
        return new PointPredicateResult(`(${andPointPredicateId})`, true, [], [], [], new Set(), [...results]);
    }

    and(newPointPredicateId?: string, ...otherResults: PointPredicateResult[]) {
        return PointPredicateResult.and(newPointPredicateId, this, ...otherResults);
    }

    static or(newPointPredicateId?: string, ...results: PointPredicateResult[]) {
        const orPointPredicateId: string = newPointPredicateId ?? `(${results.map(result => result.pointPredicateId).reduce((accum, pointPredicateId) => accum.concat("_||_" + pointPredicateId))})`;
        for (const result of results) {
            if (result.success) {
                return new PointPredicateResult(`(${orPointPredicateId})`, true, result.successTiles, result.failureTiles, result.missingTiles, result._matchedMeldIndicesSubsets, [result]);
            }
        }
        // all unsuccessful, results have better detail on success/failure tiles
        return new PointPredicateResult(orPointPredicateId, false, [], [], [], new Set(), [...results]);
    }

    or(newPointPredicateId?: string, ...otherResults: PointPredicateResult[]) {
        return PointPredicateResult.or(newPointPredicateId, this, ...otherResults);
    }
}

export function createPointPredicateSuccessResult(pointPredicateId: string,
    successTiles: Tile[][][], matchedMeldIndicesSubsets: ReadonlySet<ReadonlySet<number>>,
    subPredicateResults?: PointPredicateResult[]) {
    return new PointPredicateResult(pointPredicateId, true, successTiles, [], [], matchedMeldIndicesSubsets, subPredicateResults);
}

export function createPointPredicateFailureResult(pointPredicateId: string,
    failureTiles: Tile[][], missingTiles: Tile[][], 
    subPredicateResults?: PointPredicateResult[]) {
    return new PointPredicateResult(pointPredicateId, false, [], failureTiles, missingTiles, new Set(), subPredicateResults);
}