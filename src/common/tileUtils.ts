import { type FlowerTile, isFlowerTile } from "model/tile/group/flowerTile";
import { type SuitedOrHonorTile, isSuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { isSuitedTile } from "model/tile/group/suitedTile";
import { type HongKongTile, isHongKongTile } from "model/tile/hk/hongKongTile";
import { Tile, compareTiles } from "model/tile/tile";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { TileGroup } from "model/tile/tileGroup";

export function assertTilesNotNullAndCorrectLength(tiles: Tile[], minLength: number, maxLength: number) {
    if (!tiles || !tiles.every(tile => !!tile)) {
        throw new Error("tiles and its items cannot be null or undefined.");
    }
    if (minLength > maxLength || minLength < 0 || maxLength < 0) {
        throw new Error("lengths must be > 0, and minLength must be less than or equal to maxLength");
    }
    if (tiles.length < minLength || tiles.length > maxLength) {
        throw new Error("tiles must have length between " + minLength + " and " + maxLength);
    }
}

export function assertTilesHaveSameSuitedGroup(tiles: Tile[]) {
    const firstTile = tiles[0];
    if (!firstTile) {
        throw new Error("tiles cannot be empty");
    }
    if (!tiles.every((tile) => isSuitedTile(tile) && !!tile && tile.group === firstTile.group)) {
        throw new Error("Each tile must be of the same SuitedTile TileGroup"); 
    }
}

export function assertTilesSuitedOrHonor(tiles: Tile[]): tiles is SuitedOrHonorTile[] {
    if (!tiles.every(tile => isSuitedOrHonorTile(tile))) {
        throw new Error("Tiles must only contain SuitedOrHonorTiles."); 
    }
    return true;
}

export function assertTileSuitedOrHonor(tile: Tile): tile is SuitedOrHonorTile {
    if (!isSuitedOrHonorTile(tile)) {
        throw new Error("Tile must be a SuitedOrHonorTile."); 
    }
    return true;
}

export function assertTilesFlower(tiles: Tile[]): tiles is FlowerTile[] {
    if (!tiles.every(tile => isFlowerTile(tile))) {
        throw new Error("Tiles must only contain FlowerTiles."); 
    }
    return true;
}

export function assertTilesHongKongTile(tiles: Tile[]): tiles is HongKongTile[] {
    if (!tiles.every(tile => isHongKongTile(tile))) {
        throw new Error("Tiles must only contain HongKongTiles."); 
    }
    return true;
}

export function tilesDoesNotContainTile(tiles: Tile[], tile: Tile): boolean {
    return tiles.every(tileInArray => !tileInArray.equals(tile));
}

export function tilesUnique(tiles: Tile[]): boolean {
    if (!tiles) {
        throw new Error("tiles cannot be null or undefined.");
    }
    const sortedTiles = [...tiles].sort(compareTiles);
    if (!sortedTiles.every(tile => !!tile)) {
        throw new Error("tiles' items cannot be null or undefined.");
    }
    if (sortedTiles.length < 2) {
        return true;
    }
    return sortedTiles.every((tile, index) => 
        index + 1 < sortedTiles.length ? !tile.equals(sortedTiles[index + 1]) : true);
}

export function assertEachTileHasQuantityLTEMaxPerTile(tiles: SuitedOrHonorTile[]) {
    const tileToQuantity : TileToQuantityMap = new TileToQuantityMap(tiles);
    const quantityPerUniqueTile : number[] = tileToQuantity.getQuantityPerUniqueTile();
    if (!quantityPerUniqueTile.every(quantity => quantity <= maxQuantityPerNonFlowerTile)) {
        throw new Error(`Each suited or honor tile must have quantity <= ${maxQuantityPerNonFlowerTile}.`);
    }
}

export function partitionTilesByGroup(tiles: Tile[]): Tile[][] {
    const tileGroupToTilesMap : Map<TileGroup, Tile[]> = new Map();
    tiles.forEach(tile => {
        const tiles = tileGroupToTilesMap.get(tile.group);
        if (tiles) {
            tiles.push(tile);
            tiles.sort(compareTiles);
        } else {
            tileGroupToTilesMap.set(tile.group, [tile]);
        }
        
    });
    return [...tileGroupToTilesMap.values()];
}