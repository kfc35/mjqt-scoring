import GentlemanTile from "model/tile/group/gentlemanTile";
import SeasonTile from "model/tile/group/seasonTile";
import { type SuitedOrHonorTile, type SuitedOrHonorTileValue } from "model/tile/group/suitedOrHonorTile";
import { GentlemanTileValue, SeasonTileValue, DragonTileValue } from "model/tile/tileValue";
import { TileGroup } from "model/tile/tileGroup";
import { Tile } from "model/tile/tile";
import { TileValue } from "model/tile/tileValue";

export type FlowerTile = GentlemanTile | SeasonTile;
export const flowerTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.GENTLEMAN, TileGroup.SEASON]);
export type FlowerTileValue = GentlemanTileValue | SeasonTileValue;

export function isFlowerTile(tile: Tile) : tile is FlowerTile {
    return flowerTileGroups.has(tile.group);
}

/* For certain winning hands (e.g. in HK scoring), a dragon is associated with a suit.*/
export const dragonTileToTileGroup : ReadonlyMap<DragonTileValue, TileGroup> = new Map<DragonTileValue, TileGroup>([
    [DragonTileValue.FAAT, TileGroup.BAMBOO],
    [DragonTileValue.ZONG, TileGroup.CHARACTER],
    [DragonTileValue.BAAK, TileGroup.CIRCLE],
])
export const hongKongTileGroups : ReadonlySet<TileGroup> = new Set([TileGroup.GENTLEMAN, TileGroup.SEASON, 
    TileGroup.DRAGON, TileGroup.WIND, TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]);

export type HongKongTile = FlowerTile | SuitedOrHonorTile;
export type HongKongTileValue = FlowerTileValue | SuitedOrHonorTileValue;

// TODO 
export function constructTile<T extends Tile>(group: TileGroup, value: TileValue) : T {
    return undefined;
}