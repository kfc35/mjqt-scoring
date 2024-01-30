import GentlemanTile from "model/tile/group/gentlemanTile";
import SeasonTile from "model/tile/group/seasonTile";
import { type SuitedOrHonorTile, type SuitedOrHonorTileValue } from "model/tile/group/suitedOrHonorTile";
import { GentlemanTileValue, SeasonTileValue, DragonTileValue } from "model/tile/tileValue";
import { TileGroup } from "model/tile/tileGroup";

export type FlowerTile = GentlemanTile | SeasonTile;
export const flowerTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.GENTLEMAN, TileGroup.SEASON]);
export type FlowerTileValue = GentlemanTileValue | SeasonTileValue;

/* For certain winning hands (e.g. in HK scoring), a dragon is associated with a suit.*/
export const dragonTileToTileGroup : ReadonlyMap<DragonTileValue, TileGroup> = new Map<DragonTileValue, TileGroup>([
    [DragonTileValue.FAAT, TileGroup.BAMBOO],
    [DragonTileValue.BAAK, TileGroup.CIRCLE],
    [DragonTileValue.ZONG, TileGroup.CHARACTER],
])

export type HongKongTile = FlowerTile | SuitedOrHonorTile;
export type HongKongTileValue = FlowerTileValue | SuitedOrHonorTileValue;
