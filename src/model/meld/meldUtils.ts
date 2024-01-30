import { assertTilesNotNullAndCorrectLength } from "common/tileUtils";
import { Tile } from "model/tile/tile.js";
import { TileGroup } from "model/tile/tileGroup";

export const meldMinLength = 2;
export const meldMaxLength = 4;

/** Assertion functions that Meld constructors use. */
export function assertTilesHaveSameType(tiles: Tile[], allowedTypes: ReadonlySet<TileGroup>) {
    assertTilesNotNullAndCorrectLength(tiles, meldMinLength, meldMaxLength);
    if (!tiles.map((tile) => tile.getGroup())
            .every((tileType) => allowedTypes.has(tileType) && tileType === tiles[0]!.getGroup())) {
        throw new TypeError("Each tile in a meld must be of the same TileType " + 
            "and must be one of the following types: " + stringifyTypes(allowedTypes)); 
    }
}

export function assertTilesHaveSameTypeAndValue(tiles: Tile[], allowedTypes: ReadonlySet<TileGroup>) {
    assertTilesNotNullAndCorrectLength(tiles, meldMinLength, meldMaxLength);
    if (!tiles.every((tile) => allowedTypes.has(tile.getGroup())
        && tile.getGroup() === tiles[0]!.getGroup() && tile.value === tiles[0]!.value)) {
        throw new TypeError("Each tile in a meld must be of the same TileType " + 
            "and must be one of the following types: " + stringifyTypes(allowedTypes)); 
    }
}

function stringifyTypes(types: ReadonlySet<TileGroup>) {
    let typesStr = "";
    types.forEach(type => typesStr += type + " ")
    return typesStr;
}