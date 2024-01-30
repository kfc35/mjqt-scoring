import { type HonorTile, type HonorTileValue, honorTileGroups } from "model/tile/group/honorTile";
import SuitedTile from "model/tile/group/suitedTile";
import { SuitedTileValue } from "model/tile/tileValue";
import { suitedTileGroups } from "model/tile/group/suitedTile";
import { TileGroup } from "model/tile/tileGroup";

export type SuitedOrHonorTile = HonorTile | SuitedTile;
export type SuitedOrHonorTileValue = HonorTileValue | SuitedTileValue;
export const suitedAndHonorTileGroups: ReadonlySet<TileGroup> = new Set([...honorTileGroups, 
    ...suitedTileGroups]);