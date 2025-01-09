import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue, isDragonTileValue } from "model/tile/tileValue";

export default class DragonTile extends Tile {
    declare protected _value: DragonTileValue;

    constructor(value: DragonTileValue) {
        super(TileGroup.DRAGON, value);
    }

    copy(): DragonTile {
        return new DragonTile(this._value);
    }
}

export function isDragonTile(tile: Tile): tile is DragonTile {
    return tile.group === TileGroup.DRAGON && isDragonTileValue(tile.value);
}