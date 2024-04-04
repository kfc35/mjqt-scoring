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
}