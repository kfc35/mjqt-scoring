"use strict";

import { SuitedTile } from "model/tile/tile.js";
import { Meld, MeldType } from "model/meld/meld.js";
import { suitedTileTypes, assertTilesHaveSameType } from "model/meld/meldUtils.js";

export class Chow extends Meld {
    private meldType: MeldType = MeldType.CHOW;

    constructor(tiles: [SuitedTile, SuitedTile, SuitedTile], 
        exposed?: boolean) {
        assertTilesHaveSameType(tiles, suitedTileTypes);
        
        // Ascending order. Shallow copy is ok here since tiles are immutable.
        const tilesShallowCopy : [SuitedTile, SuitedTile, SuitedTile] = [...tiles];
        tilesShallowCopy.sort(function(tile1: SuitedTile, tile2: SuitedTile){
            return tile1.compareTo(tile2);
        });
        if (!tilesShallowCopy[0].isOneBefore(tilesShallowCopy[1])
            || !tilesShallowCopy[1].isOneBefore(tilesShallowCopy[2])) {
            throw new TypeError("Tiles in a Chow must be a consecutive run (e.g. 1,2,3 or 2,3,4 ... or 7,8,9).");
        }

        super(tilesShallowCopy, exposed);
    }

    getType(): MeldType {
        return this.meldType;
    }
}