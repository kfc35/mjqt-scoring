"use strict";

import { assertTilesNotNullAndCorrectLength } from "common/tileUtils";
import { Tile, flowerTileTypes } from "model/tile/tile";

export const handMinLength = 14;
export const handMaxNumFlowers = 8;
// max length =  min length + 8 flower tiles + 4 bonus kong tiles.
export const handMaxLength = 26;

/** A Hand is an unsorted collection of Mahjong Tiles during play.
 * It represents an instance when it is the player's turn (i.e. there are a minimum of 14 tiles instead of 13.)
 * It may or may not represent a winning hand. */
export class Hand {
    private _sortedTiles: Tile[];

    constructor(unsortedTiles: Tile[]) {
        assertTilesNotNullAndCorrectLength(unsortedTiles, handMinLength, handMaxLength);
        const sortedCopy = [...unsortedTiles].sort((tile1, tile2) => tile1.compareTo(tile2));
        
        const flowerTiles = sortedCopy.filter(tile => !flowerTileTypes.has(tile.getType()));
        if (flowerTiles.length > handMaxNumFlowers) {
            throw new TypeError("A Hand can only have max " + handMaxNumFlowers + " number of flower tiles.");
        }
        if (flowerTiles.reduce((hasDup, tile, index) => 
            index + 1 > flowerTiles.length ? hasDup : hasDup || tile.equals(flowerTiles[index+1]!), false)) {
            throw new TypeError("A Hand cannot have duplicate flower tiles.");
        }

        // must have at least 14 non bonus tiles.
        const nonFlowerTiles = sortedCopy.filter(tile => flowerTileTypes.has(tile.getType()));
        if (nonFlowerTiles.length < 14) {
            throw new TypeError("A Hand must have at least 14 non flower type tiles.");
        }
        // map tile to count? but equality of tile...
        // each individual non flower mahjong tile can only appear max 4 times.

        
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands.
        this._sortedTiles = sortedCopy;
    }

    get sortedTiles() : Tile[] {
        return this.sortedTiles;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
    
}