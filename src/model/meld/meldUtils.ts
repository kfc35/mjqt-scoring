import { assertTilesNotNullAndCorrectLength } from "common/tileUtils";
import { Tile, TileType } from "model/tile/tile.js";

export const meldMinLength = 2;
export const meldMaxLength = 4;

/** Assertion functions that Meld constructors use. */
export function assertTilesHaveSameType(tiles: Tile[], allowedTypes: ReadonlySet<TileType>) {
    assertTilesNotNullAndCorrectLength(tiles, meldMinLength, meldMaxLength);
    if (!tiles.map((tile) => tile.getType())
            .every((tileType) => allowedTypes.has(tileType) && tileType === tiles[0]!.getType())) {
        throw new TypeError("Each tile in a meld must be of the same TileType " + 
            "and must be one of the following types: " + stringifyTypes(allowedTypes)); 
    }
}

export function assertTilesHaveSameTypeAndValue(tiles: Tile[], allowedTypes: ReadonlySet<TileType>) {
    assertTilesNotNullAndCorrectLength(tiles, meldMinLength, meldMaxLength);
    if (!tiles.every((tile) => allowedTypes.has(tile.getType()) && tile.value === tiles[0]!.value)) {
        throw new TypeError("Each tile in a meld must be of the same TileType " + 
            "and must be one of the following types: " + stringifyTypes(allowedTypes)); 
    }
}

function stringifyTypes(types: ReadonlySet<TileType>) {
    let typesStr = "";
    types.forEach(type => typesStr += type + " ")
    return typesStr;
}