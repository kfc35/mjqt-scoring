import { TileGroup } from "model/tile/tileGroup";
import { type TileValue, GentlemanTileValue, SeasonTileValue, DragonTileValue, WindTileValue, SuitedTileValue } from "model/tile/tileValue";
import { HongKongTile } from "model/tile/hk/hongKongTile";

export function createTileToQuantityMap(tiles: HongKongTile[]) : ReadonlyMap<TileGroup, Map<TileValue, number>> {
    // TODO make it based off of HongKongTile sets.
    const tileToQuantity : Map<TileGroup, Map<TileValue, number>>= new Map();
    tileToQuantity.set(TileGroup.GENTLEMAN, new Map<GentlemanTileValue, number>());
    tileToQuantity.set(TileGroup.SEASON, new Map<SeasonTileValue, number>());
    tileToQuantity.set(TileGroup.DRAGON, new Map<DragonTileValue, number>());
    tileToQuantity.set(TileGroup.WIND, new Map<WindTileValue, number>());
    tileToQuantity.set(TileGroup.BAMBOO, new Map<SuitedTileValue, number>());
    tileToQuantity.set(TileGroup.CHARACTER, new Map<SuitedTileValue, number>());
    tileToQuantity.set(TileGroup.CIRCLE, new Map<SuitedTileValue, number>());
    tiles.forEach(tile => {
        const quantityMap: Map<TileValue, number> | undefined = tileToQuantity.get(tile.getGroup());
        if (!quantityMap) {
            throw new Error("Invalid tile group: " + tile.getGroup());
        }
        const prevValue: number | undefined = quantityMap.get(tile.value);
        if (prevValue) {
            quantityMap.set(tile.value, prevValue + 1);
        } else {
            quantityMap.set(tile.value, 1);
        }
    });
    return tileToQuantity;
}