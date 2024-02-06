import { assertTilesNotNullAndCorrectLength } from "common/tileUtils";
import { Tile } from "model/tile/tile.js";
import { TileGroup } from "model/tile/tileGroup";

export const meldMinLength = 2;
export const meldMaxLength = 4;

/** Assertion functions that Meld constructors use. */
export function assertTilesHaveSameType(tiles: Tile[], allowedGroups: ReadonlySet<TileGroup>) {
    assertTilesNotNullAndCorrectLength(tiles, meldMinLength, meldMaxLength);
    if (!tiles.map((tile) => tile.group)
            .every((tileGroup) => allowedGroups.has(tileGroup) && tileGroup === tiles[0]!.group)) {
        throw new TypeError("Each tile in a meld must be of the same TileGroup " + 
            "and must be one of the following types: " + stringifyGroups(allowedGroups)); 
    }
}

export function assertTileHasGroup(tile: Tile, allowedGroups: ReadonlySet<TileGroup>) {
    if (!allowedGroups.has(tile.group)) {
        throw new TypeError("Tiles in a meld must be one of the following types: " + stringifyGroups(allowedGroups)); 
    }
}

export function assertTilesHaveSameTypeAndValue(tiles: Tile[], allowedGroups: ReadonlySet<TileGroup>) {
    assertTilesNotNullAndCorrectLength(tiles, meldMinLength, meldMaxLength);
    if (!tiles.every((tile) => allowedGroups.has(tile.group)
        && tile.group === tiles[0]!.group && tile.value === tiles[0]!.value)) {
        throw new TypeError("Each tile in a meld must be of the same TileGroup " + 
            "and must be one of the following types: " + stringifyGroups(allowedGroups)); 
    }
}

function stringifyGroups(groups: ReadonlySet<TileGroup>) {
    let groupsStr = "";
    groups.forEach(group => groupsStr += group + " ")
    return groupsStr;
}