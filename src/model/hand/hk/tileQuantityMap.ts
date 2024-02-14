import { TileGroup } from "model/tile/tileGroup";
import { GentlemanTileValue, SeasonTileValue, DragonTileValue, WindTileValue, SuitedTileValue, type TileValue } from "model/tile/tileValue";
import { flowerTileGroups, constructTile } from "model/tile/hk/hongKongTile";
import { Tile } from "model/tile/tile";
import { tileArrayDoesNotContain } from "common/tileUtils";

// Wrapper class for mapping a tile to its quantity in a hand.
export class TileToQuantityMap {
    _tileToQuantityMap: ReadonlyMap<TileGroup, ReadonlyMap<TileValue, number>>;

    constructor(tiles: Tile[]) {
        const tileToQuantityMap: Map<TileGroup, Map<TileValue, number>>= new Map();
        tileToQuantityMap.set(TileGroup.GENTLEMAN, new Map<GentlemanTileValue, number>());
        tileToQuantityMap.set(TileGroup.SEASON, new Map<SeasonTileValue, number>());
        tileToQuantityMap.set(TileGroup.DRAGON, new Map<DragonTileValue, number>());
        tileToQuantityMap.set(TileGroup.WIND, new Map<WindTileValue, number>());
        tileToQuantityMap.set(TileGroup.BAMBOO, new Map<SuitedTileValue, number>());
        tileToQuantityMap.set(TileGroup.CHARACTER, new Map<SuitedTileValue, number>());
        tileToQuantityMap.set(TileGroup.CIRCLE, new Map<SuitedTileValue, number>());
        // TODO ensure all TileGroups exhausted?
        tiles.forEach(tile => {
            const tileValToQuantityMap: Map<TileValue, number> | undefined = tileToQuantityMap.get(tile.group);
            if (!tileValToQuantityMap) {
                throw new Error("Invalid tile group: " + tile.group);
            }
            const prevValue: number | undefined = tileValToQuantityMap.get(tile.value);
            if (prevValue) {
               tileValToQuantityMap.set(tile.value, prevValue + 1);
            } else {
               tileValToQuantityMap.set(tile.value, 1);
            }
        });
        this._tileToQuantityMap = tileToQuantityMap;
    }

    getQuantityPerUniqueTile(): number[] {
        return [...this._tileToQuantityMap.values()] // Map<TileValue,Number>[]
            .map((v) => [...v.values()]) // number[][]
            .reduce<number[]>((accum, numberArray) => accum.concat(numberArray), []);
    }

    getQuantity(tile: Tile) : number {
        const groupMap = this._tileToQuantityMap.get(tile.group);
        if (!groupMap) {
            return 0;
        }
        return groupMap.get(tile.value) ?? 0;
    }

    getQuantityNonFlowerTiles() : number {
        return [...this._tileToQuantityMap.entries()]
        .filter(([tileGroup,]) => !flowerTileGroups.has(tileGroup))
        .map(([, map]) => [...map.values()]) // number[][]
        .reduce<number[]>((accum, numberArray) => accum.concat(numberArray), [])
        .reduce<number>((sum, quantity) => sum + quantity, 0);
    }

    getQuantityToTileMap() : ReadonlyMap<number, Tile[]> {
        const invertedMap = new Map<number, Tile[]>();
        for (const [tileGroup, innerMap] of this._tileToQuantityMap.entries()) {
            for (const [tileValue, quantity] of innerMap.entries()) {
                const tileArray = invertedMap.get(quantity);
                const tile = constructTile(tileGroup, tileValue);
                if (tileArray) {
                    if (tileArrayDoesNotContain(tileArray, tile)) {
                        tileArray.push(tile);
                    } // else no-op, array already containes tile.
                } else {
                    invertedMap.set(quantity, [tile]);
                }
            }
        }
        return invertedMap;
    }
}