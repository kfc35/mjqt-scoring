import { Tile } from "model/tile/tile";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue } from "model/tile/tileValue";

export default abstract class SuitedTile extends Tile {
    constructor(value: SuitedTileValue) {
        super(value);
    }

    isOneBefore(otherTile: SuitedTile): boolean {
        return this.getGroup() === otherTile.getGroup() && 
            (this.value as SuitedTileValue).valueOf() + 1 === (otherTile.value as SuitedTileValue).valueOf();
    }
}

export const suitedTileGroups: ReadonlySet<TileGroup> = new Set([TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]);
