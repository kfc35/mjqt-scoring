import DragonTile from "model/tile/group/dragonTile";
import WindTile from "model/tile/group/windTile";
import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue, WindTileValue } from "model/tile/tileValue";

export type HonorTile = DragonTile | WindTile;
export type HonorTileValue = DragonTileValue | WindTileValue;
export const honorTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.DRAGON, TileGroup.WIND]);

export function isHonorTile(tile: Tile): tile is HonorTile {
    return honorTileGroups.has(tile.group);
}