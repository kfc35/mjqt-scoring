import { TileGroup } from "model/tile/tileGroup";
import SuitedTile from "model/tile/group/suitedTile";
import { SuitedTileValue } from "model/tile/tileValue";

export default class CircleTile extends SuitedTile {
    constructor(value: SuitedTileValue) {
        super(TileGroup.CIRCLE, value);
    }

    override copy(): CircleTile {
        return new CircleTile(this._value);
    }
}