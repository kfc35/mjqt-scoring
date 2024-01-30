import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { MeldType } from "model/meld/meldType";

export default abstract class Meld {
    protected _tiles: SuitedOrHonorTile[];
    private _exposed: boolean;

    constructor(tiles: SuitedOrHonorTile[], exposed?: boolean) {
        this._tiles = tiles;
        this._exposed = (exposed ? exposed : false);
    }

    abstract getType(): MeldType;

    get tiles(): typeof this._tiles {
        return this._tiles;
    }

    get exposed(): boolean {
        return this._exposed;
    }
}