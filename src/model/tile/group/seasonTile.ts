import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { SeasonTileValue } from "model/tile/tileValue";

export default class SeasonTile extends Tile {
    declare protected _value: SeasonTileValue;

    constructor(value: SeasonTileValue) {
        super(TileGroup.SEASON, value);
    }

    getGroup(): TileGroup.SEASON {
        return TileGroup.SEASON;
    }

    override copy(): SeasonTile {
        return new SeasonTile(this._value);
    }
}