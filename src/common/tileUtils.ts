import { Tile } from "model/tile/tile.js";

export function assertTilesNotNullAndCorrectLength(tiles: Tile[], minLength: number, maxLength: number) {
    if (!tiles || 
        tiles.map((tile) => !tile).reduce((isNullOrUndefAgg, isNullOrUndef) => isNullOrUndefAgg || isNullOrUndef, false)) {
        throw new TypeError("tiles and its items cannot be null or undefined.");
    }
    if (tiles.length < minLength || tiles.length > maxLength) {
        throw new TypeError("tiles must have length between " + minLength + " and " + maxLength);
    }
}