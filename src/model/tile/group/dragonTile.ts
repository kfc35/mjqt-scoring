import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue } from "model/tile/tileValue";

export default class DragonTile extends Tile {
    declare protected _value: DragonTileValue;

    constructor(value: DragonTileValue) {
        super(value);
    }

    getGroup(): TileGroup.DRAGON {
        return TileGroup.DRAGON;
    }
}