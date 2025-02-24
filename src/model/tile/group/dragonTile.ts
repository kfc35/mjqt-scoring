import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue } from "model/tile/tileValue";
import HonorTile from "model/tile/group/honorTile";

export default class DragonTile extends HonorTile {
    declare protected _value: DragonTileValue;

    constructor(value: DragonTileValue) {
        super(TileGroup.DRAGON, value);
    }

    clone(): DragonTile {
        return new DragonTile(this._value);
    }
}