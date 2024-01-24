"use strict";

import { TileType, SuitedOrHonorTile, SuitedOrHonorTileValue } from "./tile.js";

interface Meld {
    getTiles(): SuitedOrHonorTile[];
    isExposed(): boolean;
}

// TODO should pong and kong have info about who they ate from?

export class Chow implements Meld {
    private tiles: SuitedOrHonorTile[];
    exposed: boolean;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile], exposed?: boolean) {
        assertTilesAreNotFlowerAndAreSameType(tiles);
        
        var copiedTiles = JSON.parse(JSON.stringify(tiles));
        copiedTiles.sort(function(tile1: SuitedOrHonorTile, tile2: SuitedOrHonorTile){return tile1.getValue().valueOf() - tile2.getValue().valueOf()})
        if (copiedTiles[0].getValue().valueOf() +1 !== copiedTiles[1].getValue().valueOf() || 
            copiedTiles[1].getValue().valueOf() +1 !== copiedTiles[2].getValue().valueOf()
        ) {
            throw new TypeError("Tiles in a Chow must be a consecutive run (e.g. 1,2,3 or 2,3,4 ... or 7,8,9).");
        }

        this.tiles = copiedTiles;
        this.exposed = (exposed ? exposed : false);
    }

    getTiles(): SuitedOrHonorTile[] {
        return this.tiles;
    }

    isExposed(): boolean {
        return this.exposed;
    }
}

export class Pair implements Meld {
    private tiles: SuitedOrHonorTile[];
    exposed: boolean;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile]) {
        assertTilesAreNotFlowerAndAreSameType(tiles);
        assertTilesSameValue(tiles);

        var copiedTiles = JSON.parse(JSON.stringify(tiles));
        this.tiles = copiedTiles;
        this.exposed = false;
    }

    getTiles(): SuitedOrHonorTile[] {
        return this.tiles;
    }

    isExposed(): boolean {
        return this.exposed;
    }
}

export class Pong implements Meld {
    private tiles: SuitedOrHonorTile[];
    exposed: boolean;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile], exposed?: boolean) {
        assertTilesAreNotFlowerAndAreSameType(tiles);
        assertTilesSameValue(tiles);

        var copiedTiles = JSON.parse(JSON.stringify(tiles));
        this.tiles = copiedTiles;
        this.exposed = (exposed ? exposed : false);
    }

    getTiles(): SuitedOrHonorTile[] {
        return this.tiles;
    }

    isExposed(): boolean {
        return this.exposed;
    }
}

export class Kong implements Meld {
    private tiles: SuitedOrHonorTile[];
    exposed: boolean;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile], exposed?: boolean) {
        assertTilesAreNotFlowerAndAreSameType(tiles);
        assertTilesSameValue(tiles);

        var copiedTiles = JSON.parse(JSON.stringify(tiles));
        this.tiles = copiedTiles;
        this.exposed = (exposed ? exposed : false);
    }

    getTiles(): SuitedOrHonorTile[] {
        return this.tiles;
    }

    isExposed(): boolean {
        return this.exposed;
    }
}

/** Assertion functions for Meld constructors to use. */
function assertTilesAreNotFlowerAndAreSameType(tiles: SuitedOrHonorTile[]) {
    if (!tiles || !tiles[0]) {
        throw new TypeError("Tiles cannot be null.");
    }
    tiles.forEach(function (tile: SuitedOrHonorTile) {
        if (!tile) throw new TypeError("Each tile must be defined and non-null."); 
    });
    if (tiles.length < 2 || tiles.length > 4) {
        throw new TypeError("Tiles in a meld must be of length 2, 3, or 4.");
    }
    
    const tileType: TileType = tiles[0].getType();
    tiles.forEach(function (tile: SuitedOrHonorTile) {
        // tileType will be valid (i.e. a GameTile TileType) because the tiles are of type GameTile.
        if (!tile) {
            throw new TypeError("Tiles cannot be null");
        }
        if (tile.getType() !== tileType) {
            throw new TypeError("Each tile in a meld must be of the same TileType."); 
        }
    });
}

function assertTilesSameValue(tiles: SuitedOrHonorTile[]) {
    if (!tiles || !tiles[0]) {
        throw new TypeError("Tiles cannot be null.");
    }
    if (tiles.length < 2 || tiles.length > 4) {
        throw new TypeError("Tiles in a meld must be of length 2, 3, or 4.");
    }
    const tileValue: SuitedOrHonorTileValue = tiles[0].getValue();
    tiles.forEach(function (tile: SuitedOrHonorTile) {
        if (!tile) {
            throw new TypeError("Tiles cannot be null");
        }
        if (tile.getValue() !== tileValue) {
            throw new TypeError("Each tile in a Pong/Kong must have an equal TileValue.");
        }
    });
}