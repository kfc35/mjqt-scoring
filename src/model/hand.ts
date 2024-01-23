"use strict";

import { Tile } from "./tile.js";

export class Hand {
    tiles: Tile[];

    constructor(tiles: Tile[]) {
        this.tiles = tiles!;
    }
}