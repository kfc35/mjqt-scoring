import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { MeldType } from "model/meld/meldType";
import { assertTilesSuitedOrHonor } from "common/tileUtils";

export default abstract class Meld {
    protected _tiles: SuitedOrHonorTile[];
    protected _type: MeldType;
    private _exposed: boolean;

    constructor(tiles: SuitedOrHonorTile[], type: MeldType, exposed?: boolean) {
        assertTilesSuitedOrHonor(tiles);
        this._tiles = [...tiles].sort(function(tile1: SuitedOrHonorTile, tile2: SuitedOrHonorTile){
            return tile1.compareTo(tile2);
        });
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

    equals(meld: Meld | undefined): boolean {
        if (!meld) {
            return false;
        }
        if (this._tiles.length !== meld.tiles.length) {
            return false;
        }
        // tiles is sorted in both meld objects.
        if (!this._tiles.every((tile, index) => tile.equals(meld.tiles[index]))) {
            return false;
        }
        return this._type === meld.type && this._exposed === meld.exposed;
    }
}