import { type FlowerTile, type FlowerTileValue, isFlowerTile } from "model/tile/group/flowerTile";
import { type SuitedOrHonorTile, type SuitedOrHonorTileValue, isSuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { TileGroup } from "model/tile/tileGroup";
import { Tile } from "model/tile/tile";

export const hongKongTileGroups : ReadonlySet<TileGroup> = new Set([TileGroup.GENTLEMAN, TileGroup.SEASON, 
    TileGroup.DRAGON, TileGroup.WIND, TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]);
export type HongKongTile = FlowerTile | SuitedOrHonorTile;
export type HongKongTileValue = FlowerTileValue | SuitedOrHonorTileValue;
export function isHongKongTile(tile: Tile): tile is HongKongTile {
    return isFlowerTile(tile) || isSuitedOrHonorTile(tile);
}