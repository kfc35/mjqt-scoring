import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue, isDragonTileValue } from "model/tile/tileValue";
import HonorTile from "./honorTile";

export default class DragonTile extends HonorTile {
    declare protected _value: DragonTileValue;

    constructor(value: DragonTileValue) {
        super(TileGroup.DRAGON, value);
    }

    clone(): DragonTile {
        return new DragonTile(this._value);
    }
}

export function isDragonTile(tile: Tile): tile is DragonTile {
    return tile.group === TileGroup.DRAGON && isDragonTileValue(tile.value);
}