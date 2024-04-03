import Meld from "model/meld/meld";
import { Tile } from "model/tile/tile";

export default class PointPredicateResult {
    private _pointPredicateId: string;
    private _success: boolean;
    private _matchedTiles: Meld[] | Tile[];

    constructor(_pointPredicateId: string, success: boolean, _matchedTiles: Meld[] | Tile[]) {
        this._pointPredicateId = _pointPredicateId;
        this._success = success;
        this._matchedTiles = _matchedTiles;
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
}