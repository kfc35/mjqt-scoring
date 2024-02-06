import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { WindTileValue } from "model/tile/tileValue";

export default class WindTile extends Tile {
    declare protected _value: WindTileValue;
    
    constructor(value: WindTileValue) {
        super(TileGroup.WIND, value);
    }

    override copy(): WindTile {
        return new WindTile(this._value);
    }
}
