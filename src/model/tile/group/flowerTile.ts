import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { GentlemanTile, isGentlemanTile } from "model/tile/group/gentlemanTile";
import { SeasonTile, isSeasonTile } from "model/tile/group/seasonTile";
import { GentlemanTileValue, SeasonTileValue } from "model/tile/tileValue";

// Note: These flower tiles are standard in most East Asian mahjong games.
// SE Asia, if implemented, uses additional or different flower tiles.
export type FlowerTile = GentlemanTile | SeasonTile;
export type FlowerTileValue = GentlemanTileValue | SeasonTileValue;
export type FlowerTileGroup = TileGroup.GENTLEMAN | TileGroup.SEASON;
export const flowerTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.GENTLEMAN, TileGroup.SEASON]);
export function isFlowerTile(tile: Tile) : tile is FlowerTile {
    return isGentlemanTile(tile) || isSeasonTile(tile);
}