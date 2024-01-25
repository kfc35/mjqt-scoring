import { TileType, SuitedOrHonorTile } from "model/tile/tile.js";

export const suitedTileTypes: ReadonlySet<TileType> = new Set([TileType.BAMBOO, TileType.CIRCLE, TileType.CHARACTER]);
export const suitedAndHonorTileTypes: ReadonlySet<TileType> = new Set([TileType.DRAGON, TileType.WIND, 
    ...suitedTileTypes]);

/** Assertion functions for Meld constructors to use. */
export function assertTilesHaveSameType(tiles: SuitedOrHonorTile[], allowedTypes: ReadonlySet<TileType>) {
    assertTilesNotNullAndCorrectLength(tiles);
    if (!tiles.map((tile) => tile.getType())
            .every((tileType) => allowedTypes.has(tileType) && tileType === tiles[0]!.getType())) {
        throw new TypeError("Each tile in a meld must be of the same TileType " + 
            "and must be one of the following types: " + stringifyTypes(allowedTypes)); 
    }
}

export function assertTilesHaveSameTypeAndValue(tiles: SuitedOrHonorTile[], allowedTypes: ReadonlySet<TileType>) {
    assertTilesNotNullAndCorrectLength(tiles);
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

function assertTilesNotNullAndCorrectLength(tiles: SuitedOrHonorTile[]) {
    if (!tiles || 
        tiles.map((tile) => !tile).reduce((isNullAgg, isNull) => isNullAgg || isNull, false)) {
        throw new TypeError("tiles and its items cannot be null or undefined.");
    }
    if (tiles.length < 2 || tiles.length > 4) {
        throw new TypeError("tiles must be of length 2, 3, or 4.");
    }
}