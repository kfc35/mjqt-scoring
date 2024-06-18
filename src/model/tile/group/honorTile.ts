import DragonTile, { isDragonTile } from "model/tile/group/dragonTile";
import WindTile, { isWindTile } from "model/tile/group/windTile";
import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { type TileValue, DragonTileValue, isDragonTileValue, WindTileValue, isWindTileValue } from "model/tile/tileValue";

export type HonorTile = DragonTile | WindTile;
export type HonorTileValue = DragonTileValue | WindTileValue;
export type HonorTileGroup = TileGroup.DRAGON | TileGroup.WIND;
export const honorTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.DRAGON, TileGroup.WIND]);
export function isHonorTileGroup(tileGroup: TileGroup) : tileGroup is HonorTileGroup {
    return tileGroup === TileGroup.DRAGON || tileGroup === TileGroup.WIND;
}
export function isHonorTileValue(tileValue: TileValue) : tileValue is HonorTileValue {
    return isDragonTileValue(tileValue) || isWindTileValue(tileValue);
}
export function isHonorTile(tile: Tile): tile is HonorTile {
    return isDragonTile(tile) || isWindTile(tile);
}