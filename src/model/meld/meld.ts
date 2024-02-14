import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { MeldType } from "model/meld/meldType";
import { assertTilesSuitedOrHonor } from "common/tileUtils";

export default abstract class Meld {
    protected _tiles: SuitedOrHonorTile[];
    protected _type: MeldType;
    private _exposed: boolean;

    constructor(tiles: SuitedOrHonorTile[], type: MeldType, exposed?: boolean) {
        assertTilesSuitedOrHonor(tiles);
        this._tiles = tiles;
        this._type = type;
        this._exposed = (exposed ? exposed : false);
    }

    get tiles(): typeof this._tiles {
        return this._tiles;
    }

    get type(): MeldType {
        return this._type;
    }

    get exposed(): boolean {
        return this._exposed;
    }
}