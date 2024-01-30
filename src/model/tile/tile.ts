import { TileGroup } from "model/tile/tileGroup";
import { type TileValue } from "model/tile/tileValue";

export abstract class Tile {
    protected _value: TileValue;

    constructor(value: TileValue) {
        if (!value) {
            throw new TypeError("value cannot be null.")
        }
        this._value = value;
    }

    abstract getGroup(): TileGroup;

    get value(): TileValue {
        return this._value;
    }

    equals(otherTile : Tile) : boolean {
        return this.getGroup() === otherTile.getGroup() 
            && this.value === otherTile.value;
    }

    compareTo(otherTile : Tile) : number {
        if (this.getGroup() === otherTile.getGroup()) {
            if (this.value === otherTile.value) {
                return 0;
            }
            return this.value < otherTile.value ? -1 : +1
        }
        return this.getGroup() < otherTile.getGroup() ? -1 : +1
    }
}