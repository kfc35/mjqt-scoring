"use strict";

import { MahjongTile } from "../tile/tile.js";

/** A Hand is an unsorted collection of Mahjong Tiles. It may or may not be a winning hand. */
export class Hand {
    tiles: MahjongTile[];

    constructor(tiles: MahjongTile[]) {
        // assert each tile is not null
        // must have at least 14 non bonus tiles.
        // each individual mahjong tile can only appear max 4 times.
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands.
        this.tiles = tiles!;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
    
}