import { TileGroup } from "model/tile/tileGroup";
import SuitedTile from "model/tile/group/suitedTile";
import { SuitedTileValue } from "model/tile/tileValue";

export default class BambooTile extends SuitedTile {
    constructor(value: SuitedTileValue) {
        super(TileGroup.BAMBOO, value);
    }

    copy(): BambooTile {
        return new BambooTile(this._value);
    }
}
