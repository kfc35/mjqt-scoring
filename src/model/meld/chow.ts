"use strict";

import { SuitedTile, SuitedTileValue } from "../tile/tile.js";
import { Meld, MeldType } from "./meld.js";
import { suitedTileTypes, assertTilesAreSameType } from "./meldUtils.js";

export class Chow implements Meld {
    private meldType: MeldType = MeldType.CHOW;
    private tiles: [SuitedTile, SuitedTile, SuitedTile];
    exposed: boolean;

    constructor(tiles: [SuitedTile, SuitedTile, SuitedTile], 
        exposed?: boolean) {
        assertTilesAreSameType(tiles, suitedTileTypes);
        
        // Ascending order. Shallow copy is ok here since tiles are immutable.
        const tilesShallowCopy : [SuitedTile, SuitedTile, SuitedTile] = [...tiles];
        tilesShallowCopy.sort(function(tile1: SuitedTile, tile2: SuitedTile){
            return (tile1.value as SuitedTileValue).valueOf() - (tile2.value as SuitedTileValue).valueOf()
        });

        if ((tilesShallowCopy[0].value as SuitedTileValue).valueOf() +1 !== (tilesShallowCopy[1].value as SuitedTileValue).valueOf() || 
        (tilesShallowCopy[1].value as SuitedTileValue).valueOf() +1 !== (tilesShallowCopy[2].value as SuitedTileValue).valueOf()
        ) {
            throw new TypeError("Tiles in a Chow must be a consecutive run (e.g. 1,2,3 or 2,3,4 ... or 7,8,9).");
        }

        this.tiles = tilesShallowCopy;
        this.exposed = (exposed ? exposed : false);
    }

    getType(): MeldType {
        return this.meldType;
    }

    getTiles(): SuitedTile[] {
        return this.tiles;
    }

    isExposed(): boolean {
        return this.exposed;
    }
}