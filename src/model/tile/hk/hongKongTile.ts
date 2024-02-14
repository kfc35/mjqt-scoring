import GentlemanTile from "model/tile/group/gentlemanTile";
import SeasonTile from "model/tile/group/seasonTile";
import { type SuitedOrHonorTile, type SuitedOrHonorTileValue } from "model/tile/group/suitedOrHonorTile";
import { GentlemanTileValue, SeasonTileValue, DragonTileValue, SuitedTileValue, isSuitedTileValue, isDragonTileValue, isWindTileValue, isGentlemanTileValue, isSeasonTileValue } from "model/tile/tileValue";
import { TileGroup } from "model/tile/tileGroup";
import { Tile } from "model/tile/tile";
import { TileValue } from "model/tile/tileValue";
import BambooTile from "model/tile/group/bambooTile";
import CharacterTile from "model/tile/group/characterTile";
import CircleTile from "model/tile/group/circleTile";
import SuitedTile, { SuitedTileGroup } from "model/tile/group/suitedTile";
import DragonTile from "model/tile/group/dragonTile";
import WindTile from "model/tile/group/windTile";

export type FlowerTile = GentlemanTile | SeasonTile;
export const flowerTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.GENTLEMAN, TileGroup.SEASON]);
export type FlowerTileValue = GentlemanTileValue | SeasonTileValue;

export function isFlowerTile(tile: Tile) : tile is FlowerTile {
    return flowerTileGroups.has(tile.group) && 
    (tile.group === TileGroup.GENTLEMAN ? isGentlemanTileValue(tile.value) : isSeasonTileValue(tile.value));
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

export function constructSuitedTile(group: SuitedTileGroup, value: SuitedTileValue) : SuitedTile {
    switch (group) {
        case TileGroup.BAMBOO:
            return new BambooTile(value);
        case TileGroup.CHARACTER:
            return new CharacterTile(value);
        case TileGroup.CIRCLE:
            return new CircleTile(value);
        default:
            throw new Error("Non exhaustive TileGroup Check");
    }
}

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
            throw new Error("Non exhaustive TileGroup Check");
    }
}