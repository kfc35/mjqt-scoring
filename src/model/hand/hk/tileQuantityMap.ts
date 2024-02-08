import { TileGroup } from "model/tile/tileGroup";
import { GentlemanTileValue, SeasonTileValue, DragonTileValue, WindTileValue, SuitedTileValue, TileValue } from "model/tile/tileValue";
import { flowerTileGroups } from "model/tile/hk/hongKongTile";
import { Tile } from "model/tile/tile";

export class TileToQuantityMap {
    _tileToQuantityMap: ReadonlyMap<TileGroup, Map<TileValue, number>>;

    constructor(tiles: Tile[]) {
        const tileToQuantityMap: Map<TileGroup, Map<TileValue, number>>= new Map();
        tileToQuantityMap.set(TileGroup.GENTLEMAN, new Map<GentlemanTileValue, number>());
        tileToQuantityMap.set(TileGroup.SEASON, new Map<SeasonTileValue, number>());
        tileToQuantityMap.set(TileGroup.DRAGON, new Map<DragonTileValue, number>());
        tileToQuantityMap.set(TileGroup.WIND, new Map<WindTileValue, number>());
        tileToQuantityMap.set(TileGroup.BAMBOO, new Map<SuitedTileValue, number>());
        tileToQuantityMap.set(TileGroup.CHARACTER, new Map<SuitedTileValue, number>());
        tileToQuantityMap.set(TileGroup.CIRCLE, new Map<SuitedTileValue, number>());
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
}