import { TileGroup } from "model/tile/tileGroup";
import { SuitedTile } from "model/tile/group/suitedTile";
import { SuitedTileValue } from "model/tile/tileValue";

export class CircleTile extends SuitedTile {
    constructor(value: SuitedTileValue) {
        super(TileGroup.CIRCLE, value);
    }

    clone(): CircleTile {
        return new CircleTile(this._value);
    }
}