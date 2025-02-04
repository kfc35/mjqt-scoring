import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { GentlemanTileValue, isGentlemanTileValue } from "model/tile/tileValue";

export default class GentlemanTile extends Tile {
    declare protected _value: GentlemanTileValue;

    constructor(value: GentlemanTileValue) {
        super(TileGroup.GENTLEMAN, value);
    }
    
    clone(): GentlemanTile {
        return new GentlemanTile(this._value);
    }
}

export function isGentlemanTile(tile: Tile): tile is GentlemanTile {
    return tile.group === TileGroup.GENTLEMAN && isGentlemanTileValue(tile.value);
}