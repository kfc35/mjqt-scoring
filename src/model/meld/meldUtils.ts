import { TileType, SuitedOrHonorTile, SuitedOrHonorTileValue } from "../tile/tile.js";

export const suitedAndHonorTileTypes: ReadonlySet<TileType> = new Set([TileType.DRAGON, TileType.WIND, TileType.BAMBOO, TileType.CIRCLE, TileType.CHARACTER]);
export const suitedTileTypes: ReadonlySet<TileType> = new Set([TileType.BAMBOO, TileType.CIRCLE, TileType.CHARACTER]);

/** Assertion functions for Meld constructors to use. */
export function assertTilesAreSameType(tiles: SuitedOrHonorTile[], includedTypes: ReadonlySet<TileType>) {
    if (!tiles || !tiles[0]) {
        throw new TypeError("Tiles cannot be null.");
    }
    tiles.forEach(function (tile: SuitedOrHonorTile) {
        if (!tile) {
            throw new TypeError("Each tile must be defined and non-null.");
        }
        if (!includedTypes.has(tile.getType())) {
            let typesStr = "";
            includedTypes.forEach(includedType => typesStr += includedType + " ")
            throw new TypeError("Tiles must be one of the following types: " + typesStr);
        }
    });
    if (tiles.length < 2 || tiles.length > 4) {
        throw new TypeError("Tiles in a meld must be of length 2, 3, or 4.");
    }
    
    const tileType: TileType = tiles[0].getType();
    tiles.forEach(function (tile: SuitedOrHonorTile) {
        if (!tile) {
            throw new TypeError("Tiles cannot be null");
        }
        if (tile.getType() !== tileType) {
            throw new TypeError("Each tile in a meld must be of the same TileType."); 
        }
    });
}

export function assertTilesSameValue(tiles: SuitedOrHonorTile[]) {
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