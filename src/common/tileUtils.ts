import { type FlowerTile, isFlowerTile } from "model/tile/group/flowerTile";
import { type SuitedOrHonorTile, isSuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { SuitedTile, isSuitedTile, type SuitedTileGroup } from "model/tile/group/suitedTile";
import { type HongKongTile, isHongKongTile } from "model/tile/hk/hongKongTile";
import { Tile, compareTiles } from "model/tile/tile";
import { TileValue } from "model/tile/tileValue";
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

export function assertTileFlower(tile: Tile): tile is FlowerTile {
    if (!isFlowerTile(tile)) {
        throw new Error("Tile must be a FlowerTile."); 
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

export function tilesListIsEmpty(tiles: ReadonlyArray<ReadonlyArray<Tile>>): boolean {
    return tiles.length === 0 || // tiles = []
        (tiles.length === 1 && (!tiles[0] || (tiles[0].length === 0))); // tiles = [[]] or tiles = [undefined]
}

export function wrappedTilesListIsEmpty(tiles: ReadonlyArray<ReadonlyArray<ReadonlyArray<Tile>>>): boolean {
    return tiles.length === 0 || // tiles = []
        (tiles.length === 1 && (!tiles[0] || tilesListIsEmpty(tiles[0])));
}

export function suitedTilesAreAllSameSuit(tiles: SuitedTile[]): boolean {
    const tileGroups : Set<SuitedTileGroup> = new Set(tiles.map(tile => tile.group));
    return tileGroups.size === 1;
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

export function partitionTilesByTile(tiles: Tile[]): Tile[][] {
    const outerTilesMap : Map<TileGroup, Map<TileValue, Tile[]>> = new Map();
    tiles.forEach(tile => {
        let tileValueMap = outerTilesMap.get(tile.group);
        if (!tileValueMap) {
            tileValueMap = new Map();
            outerTilesMap.set(tile.group, tileValueMap);
        }
        const tiles = tileValueMap.get(tile.value);
        if (tiles) {
            tiles.push(tile);
        } else {
            tileValueMap.set(tile.value, [tile]);
        }
    });
    return [...outerTilesMap.values()]
        .map(innerMap => [...innerMap.values()])
        .reduce<Tile[][]>((accum, tiles) => accum.concat(tiles), []);
}

export function tilesListToTiles(tilesList: ReadonlyArray<ReadonlyArray<Tile>>): Tile[] {
    return tilesList.reduce<Tile[]>((accum, tiles) => accum.concat(tiles), []);
}