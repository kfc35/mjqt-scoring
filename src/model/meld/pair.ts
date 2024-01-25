import { SuitedOrHonorTile } from "../tile/tile.js";
import { Meld, MeldType } from "./meld.js";
import { suitedAndHonorTileTypes, assertTilesAreSameType, assertTilesSameValue } from "./meldUtils.js";

export class Pair implements Meld {
    private meldType: MeldType = MeldType.PAIR;
    private tiles: [SuitedOrHonorTile, SuitedOrHonorTile];
    exposed: boolean;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile]) {
        assertTilesAreSameType(tiles, suitedAndHonorTileTypes);
        assertTilesSameValue(tiles);
        this.tiles = [...tiles];
        this.exposed = false;
    }

    getType(): MeldType {
        return this.meldType;
    }

    getTiles(): SuitedOrHonorTile[] {
        return this.tiles;
    }

    isExposed(): boolean {
        return this.exposed;
    }
}