import { TileGroup } from "model/tile/tileGroup";
import { suitedTileEnumKeys, type TileValue, isSuitedTileValue } from "model/tile/tileValue";

export abstract class Tile {
    protected _group: TileGroup;
    protected _value: TileValue;

    constructor(group: TileGroup, value: TileValue) {
        if (!group || !value) {
            throw new TypeError("group and value cannot be null.")
        }
        this._group = group;
        this._value = value;
    }

    get group(): TileGroup {
        return this._group;
    }

    get value(): TileValue {
        return this._value;
    }

    equals(otherTile : Tile | undefined) : boolean {
        if (otherTile === undefined) {
            return false;
        }
        return this._group === otherTile.group 
            && this._value === otherTile.value;
    }

    compareTo(otherTile : Tile) : number {
        return compareTiles(this, otherTile);
    }

    compareToValueOnly(otherTile : Tile) : number {
        return compareTilesByValueOnly(this, otherTile);
    }

    toString(): string {
        const valueStr = (isSuitedTileValue(this._value) ? suitedTileEnumKeys[this._value.valueOf() - 1] : this._value.valueOf());
        return `${valueStr}_${this._group.valueOf()}`
    }
    
    abstract clone(): Tile;
}

export function compareTiles(a: Tile, b: Tile) : number {
    if (a.group === b.group) {
        if (a.value === b.value) {
            return 0;
        }
        return a.value < b.value ? -1 : +1
    }
    return a.group < b.group ? -1 : +1
}

export function compareTilesByValueOnly(a: Tile, b: Tile) : number {
    if (a.value === b.value) {
        return 0;
    }
    return a.value < b.value ? -1 : +1
}