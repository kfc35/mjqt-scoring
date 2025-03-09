import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue, isSuitedTileValue } from "model/tile/tileValue";

export abstract class SuitedTile extends Tile {
    declare protected _value: SuitedTileValue;
    declare protected _group: SuitedTileGroup;

    constructor(group: SuitedTileGroup, value: SuitedTileValue) {
        super(group, value);
    }

    isOneBefore(otherTile: SuitedTile): boolean {
        return this._value.valueOf() + 1 === otherTile.value.valueOf();
    }

    abstract override clone() : SuitedTile;

    override get group(): SuitedTileGroup {
        return this._group;
    }

    override get value(): SuitedTileValue {
        return this._value;
    }
}

export type SuitedTileGroup = TileGroup.BAMBOO | TileGroup.CHARACTER | TileGroup.CIRCLE;
export const suitedTileGroups: ReadonlySet<SuitedTileGroup> = new Set([TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]);
export function isSuitedTileGroup(tileGroup: TileGroup) : tileGroup is SuitedTileGroup {
    return tileGroup === TileGroup.BAMBOO || tileGroup === TileGroup.CHARACTER || tileGroup === TileGroup.CIRCLE;
}
export function isSuitedTile(tile: Tile): tile is SuitedTile {
    return isSuitedTileGroup(tile.group) && "isOneBefore" in tile && isSuitedTileValue(tile.value);
}