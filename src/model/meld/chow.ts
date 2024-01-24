"use strict";

import { SuitedTile } from "../tile/tile.js";
import { Meld, MeldType } from "./meld.js";
import { suitedTileTypes, assertTilesAreSameType } from "./meldUtils.js";

export class Chow implements Meld {
    private meldType: MeldType = MeldType.CHOW;
    private tiles: SuitedTile[];
    exposed: boolean;

    constructor(tiles: [SuitedTile, SuitedTile, SuitedTile], 
        exposed?: boolean) {
        assertTilesAreSameType(tiles, suitedTileTypes);
        
        // Ascending order
        var copiedTiles = JSON.parse(JSON.stringify(tiles));
        copiedTiles.sort(function(tile1: SuitedTile, tile2: SuitedTile){
            return tile1.getValue().valueOf() - tile2.getValue().valueOf()
        });

        if (copiedTiles[0].getValue().valueOf() +1 !== copiedTiles[1].getValue().valueOf() || 
            copiedTiles[1].getValue().valueOf() +1 !== copiedTiles[2].getValue().valueOf()
        ) {
            throw new TypeError("Tiles in a Chow must be a consecutive run (e.g. 1,2,3 or 2,3,4 ... or 7,8,9).");
        }

        this.tiles = copiedTiles;
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