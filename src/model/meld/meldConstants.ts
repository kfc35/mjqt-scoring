import { SuitedOrHonorTile, isSuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { isSuitedTile } from "model/tile/group/suitedTile";
import { Tile } from "model/tile/tile.js";

export const meldMinLength = 2;
export const meldMaxLength = 4;

/** Assertion functions that Meld constructors use. */
export function assertTilesHaveSameSuitedGroup(tiles: Tile[]) {
    if (!tiles.every((tile) => isSuitedTile(tile) && tile.group === tiles[0]!.group)) {
        throw new TypeError("Each tile in a meld must be of the same TileGroup " + 
            "and must be a suited tile."); 
    }
}

export function assertIsSuitedOrHonors(tiles: Tile[]): tiles is SuitedOrHonorTile[] {
    if (!tiles.every(tile => isSuitedOrHonorTile(tile))) {
        throw new TypeError("Tiles in this meld must be suited or honor tiles."); 
    }
    return true;
}

export function assertIsSuitedOrHonor(tile: Tile): tile is SuitedOrHonorTile {
    if (!isSuitedOrHonorTile(tile)) {
        throw new TypeError("Tiles in this meld must be suited or honor tiles."); 
    }
    return true;
}