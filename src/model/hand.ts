"use strict";

import { MahjongTile } from "./tile.js";

export class Hand {
    tiles: MahjongTile[];

    constructor(tiles: MahjongTile[]) {
        // assert each tile is not null
        this.tiles = tiles!;
    }
}