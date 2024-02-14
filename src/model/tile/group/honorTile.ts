import DragonTile from "model/tile/group/dragonTile";
import WindTile from "model/tile/group/windTile";
import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue, isDragonTileValue, WindTileValue, isWindTileValue } from "model/tile/tileValue";

export type HonorTile = DragonTile | WindTile;
export type HonorTileValue = DragonTileValue | WindTileValue;
export type HonorTileGroup = TileGroup.DRAGON | TileGroup.WIND;
export const honorTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.DRAGON, TileGroup.WIND]);

export function isHonorTile(tile: Tile): tile is HonorTile {
    return honorTileGroups.has(tile.group);
}

export function constructHonorTile(group: HonorTileGroup, value: HonorTileValue) : HonorTile {
    switch (group) {
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
        default:
            throw new Error("Non exhaustive TileGroup Check");
    }
}