import { TileGroup } from "model/tile/tileGroup";
import { WindTileValue } from "model/tile/tileValue";
import { HonorTile } from "model/tile/group/honorTile";

export class WindTile extends HonorTile {
    declare protected _value: WindTileValue;
    
    constructor(value: WindTileValue) {
        super(TileGroup.WIND, value);
    }

    clone(): WindTile {
        return new WindTile(this._value);
    }
}