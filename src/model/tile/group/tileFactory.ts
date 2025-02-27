import { TileGroup } from "model/tile/tileGroup";
import { type TileValue, isSuitedTileValue, isDragonTileValue, isWindTileValue, isGentlemanTileValue, isSeasonTileValue } from "model/tile/tileValue";
import { Tile } from "model/tile/tile";
import { BambooTile } from "model/tile/group/bambooTile";
import { CharacterTile } from "model/tile/group/characterTile";
import { CircleTile } from "model/tile/group/circleTile";
import { DragonTile } from "model/tile/group/dragonTile";
import { WindTile } from "model/tile/group/windTile";
import { GentlemanTile } from "model/tile/group/gentlemanTile";
import { SeasonTile } from "model/tile/group/seasonTile";

// Use this constructor if you do not need the more specific subtype of Tile
export function constructTile(group: TileGroup, value: TileValue) : Tile {
    switch (group) {
        case TileGroup.BAMBOO:
            if (isSuitedTileValue(value)) {
                return new BambooTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        case TileGroup.CHARACTER:
            if (isSuitedTileValue(value)) {
                return new CharacterTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        case TileGroup.CIRCLE:
            if (isSuitedTileValue(value)) {
                return new CircleTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        case TileGroup.DRAGON:
            if (isDragonTileValue(value)) {
                return new DragonTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        case TileGroup.WIND:
            if (isWindTileValue(value)) {
                return new WindTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        case TileGroup.GENTLEMAN:
            if (isGentlemanTileValue(value)) {
                return new GentlemanTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        case TileGroup.SEASON:
            if (isSeasonTileValue(value)) {
                return new SeasonTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        default:
            throw new Error("Dev Error: Non exhaustive TileGroup Check");
    }
}