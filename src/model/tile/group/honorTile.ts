import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { type TileValue, DragonTileValue, isDragonTileValue, WindTileValue, isWindTileValue, dragonTileValues, windTileValues } from "model/tile/tileValue";

export default abstract class HonorTile extends Tile {
    declare protected _value: HonorTileValue;
    declare protected _group: HonorTileGroup;

    constructor(group: HonorTileGroup, value: HonorTileValue) {
        super(group, value);
    }

    isOneBefore(otherTile: HonorTile): boolean {
        return this._group === otherTile.group && 
            this._value.valueOf() + 1 === otherTile.value.valueOf();
    }

    abstract override clone() : HonorTile;

    override get group(): HonorTileGroup {
        return this._group;
    }

    override get value(): HonorTileValue {
        return this._value;
    }
}

export type HonorTileGroup = TileGroup.DRAGON | TileGroup.WIND;
export type HonorTileValue = DragonTileValue | WindTileValue;
export const honorTileGroups: ReadonlySet<HonorTileGroup> = new Set([TileGroup.DRAGON, TileGroup.WIND]);
export function isHonorTileGroup(tileGroup: TileGroup) : tileGroup is HonorTileGroup {
    return tileGroup === TileGroup.DRAGON || tileGroup === TileGroup.WIND;
}
export function isHonorTileValue(tileValue: TileValue) : tileValue is HonorTileValue {
    return isDragonTileValue(tileValue) || isWindTileValue(tileValue);
}
export function isHonorTile(tile: Tile): tile is HonorTile {
    return (tile.group === TileGroup.DRAGON && isDragonTileValue(tile.value)) || 
        (tile.group === TileGroup.WIND && isWindTileValue(tile.value));
}

export function getHonorTileValues(honorTileGroup: HonorTileGroup) : HonorTileValue[] {
    if (honorTileGroup === TileGroup.DRAGON) {
        return dragonTileValues;
    }
    if (honorTileGroup === TileGroup.WIND) {
        return windTileValues;
    }
    return [];
}