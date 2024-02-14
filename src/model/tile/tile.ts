import { TileGroup } from "model/tile/tileGroup";
import { type TileValue } from "model/tile/tileValue";

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

    get value(): typeof this._value {
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
        if (this._group === otherTile.group) {
            if (this._value === otherTile.value) {
                return 0;
            }
            return this._value < otherTile.value ? -1 : +1
        }
        return this._group < otherTile.group ? -1 : +1
    }
    
    abstract copy(): Tile;
}