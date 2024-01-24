"use strict";

import { Hand } from "./hand.js";
import { Meld } from "../meld/meld.js";
import { MahjongTile, FlowerTile } from "../tile/tile.js";

/** A WinningHand is a Hand that has been analyzed for a wind condition. */
export class WinningHand extends Hand {
    melds: Meld[];
    bonusTiles: FlowerTile[];

    constructor(tiles: MahjongTile[], melds: Meld[], bonusTiles: FlowerTile[]) {
        super(tiles);
        // assert each tile is not null
        // must have at least 14 non bonus tiles.
        // each individual mahjong tile can only appear max 4 times.
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands.
        this.melds = melds!;
        this.bonusTiles = bonusTiles!;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
    
}