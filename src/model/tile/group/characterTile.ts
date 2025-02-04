import { TileGroup } from "model/tile/tileGroup";
import SuitedTile from "model/tile/group/suitedTile";
import { SuitedTileValue } from "model/tile/tileValue";

export default class CharacterTile extends SuitedTile {
    constructor(value: SuitedTileValue) {
        super(TileGroup.CHARACTER, value);
    }

    clone(): CharacterTile {
        return new CharacterTile(this._value);
    }
}