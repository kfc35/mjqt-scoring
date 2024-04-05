import Meld from "model/meld/meld";
import { Tile } from "model/tile/tile";

export default class PointPredicateResult {
    private _pointPredicateId: string;
    private _success: boolean;
    private _matchedTiles: Meld[] | Tile[];
    private _subPredicateResults: PointPredicateResult[];

    constructor(pointPredicateId: string, success: boolean, 
        matchedTiles: Meld[] | Tile[], subPredicateResults?: PointPredicateResult[]) {
        this._pointPredicateId = pointPredicateId;
        this._success = success;
        this._matchedTiles = matchedTiles;
        this._subPredicateResults = subPredicateResults ?? [];
    }

    get pointPredicateId(): string {
        return this._pointPredicateId;
    }

    get success(): boolean {
        return this._success;
    }

    get matchedTiles(): Meld[] | Tile[] {
        return this._matchedTiles;
    }

    get subPredicateResults(): PointPredicateResult[] {
        return this._subPredicateResults;
    }

    and(otherResult: PointPredicateResult, newPointPredicateId?: string) {
        const andPointPredicateId: string = newPointPredicateId ?? 
            `(${this._pointPredicateId}_&&_${otherResult.pointPredicateId})`;
        if (this._success && otherResult._success) {
            // the "matching tiles" for the result is more accurately described in the list of results, so we set tiles to []
            return new PointPredicateResult(andPointPredicateId, true, [], [this, otherResult]);
        }
        else if (!this._success) {
            return new PointPredicateResult(andPointPredicateId, false, this._matchedTiles, [this]);
        } else { // the otherResult is false
            return new PointPredicateResult(andPointPredicateId, false, otherResult.matchedTiles, [otherResult]);
        }
    }

    or(otherResult: PointPredicateResult, newPointPredicateId?: string) {
        const orPointPredicateId: string = newPointPredicateId ?? 
            `(${this._pointPredicateId}_||_${otherResult.pointPredicateId})`;
        if (!this._success && !otherResult._success) {
            // the "matching tiles" for the result is more accurately described in the list of results, so we set tiles to []
            return new PointPredicateResult(orPointPredicateId, false, [], [this, otherResult]);
        }
        else if (this._success) {
            return new PointPredicateResult(orPointPredicateId, true, this._matchedTiles, [this]);
        } else { // the otherResult is true
            return new PointPredicateResult(orPointPredicateId, true, otherResult.matchedTiles, [otherResult]);
        }
    }
}