import { Tile } from "model/tile/tile";
import { HonorTile, type HonorTileValue, isHonorTile } from "model/tile/group/honorTile";
import { SuitedTile, isSuitedTile } from "model/tile/group/suitedTile";
import { SuitedTileValue } from "model/tile/tileValue";

export type SuitedOrHonorTile = HonorTile | SuitedTile;
export type SuitedOrHonorTileValue = HonorTileValue | SuitedTileValue;

export function isSuitedOrHonorTile(tile: Tile): tile is SuitedOrHonorTile {
    return isSuitedTile(tile) || isHonorTile(tile);
}