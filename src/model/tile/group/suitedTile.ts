import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue, isSuitedTileValue } from "model/tile/tileValue";

export default abstract class SuitedTile extends Tile {
    declare protected _value: SuitedTileValue;

    constructor(group: TileGroup, value: SuitedTileValue) {
        super(group, value);
    }

    isOneBefore(otherTile: SuitedTile): boolean {
        return this._group === otherTile.group && 
            this._value.valueOf() + 1 === otherTile.value.valueOf();
    }

    abstract override copy() : SuitedTile;
}

export type SuitedTileGroup = TileGroup.BAMBOO | TileGroup.CHARACTER | TileGroup.CIRCLE

export const suitedTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]);

export function isSuitedTile(tile: Tile): tile is SuitedTile {
    return suitedTileGroups.has(tile.group) && "isOneBefore" in tile
        && isSuitedTileValue(tile.value);
}