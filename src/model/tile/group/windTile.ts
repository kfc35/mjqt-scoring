import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { isWindTileValue, WindTileValue } from "model/tile/tileValue";

export default class WindTile extends Tile {
    declare protected _value: WindTileValue;
    
    constructor(value: WindTileValue) {
        super(TileGroup.WIND, value);
    }

    clone(): WindTile {
        return new WindTile(this._value);
    }
}

export function isWindTile(tile: Tile): tile is WindTile {
    return tile.group === TileGroup.WIND && isWindTileValue(tile.value);
}