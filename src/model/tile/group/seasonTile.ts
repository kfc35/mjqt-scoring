import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { isSeasonTileValue, SeasonTileValue } from "model/tile/tileValue";

export default class SeasonTile extends Tile {
    declare protected _value: SeasonTileValue;

    constructor(value: SeasonTileValue) {
        super(TileGroup.SEASON, value);
    }

    clone(): SeasonTile {
        return new SeasonTile(this._value);
    }
}

export function isSeasonTile(tile: Tile): tile is SeasonTile {
    return tile.group === TileGroup.SEASON && isSeasonTileValue(tile.value);
}