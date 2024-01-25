import { SuitedOrHonorTile } from "../tile/tile.js";
import { Meld, MeldType } from "./meld.js";
import { suitedAndHonorTileTypes, assertTilesAreSameType, assertTilesSameValue } from "./meldUtils.js";

export class Pong implements Meld {
    private meldType: MeldType = MeldType.PONG;
    private tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile];
    exposed: boolean;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile], 
        exposed?: boolean) {
        assertTilesAreSameType(tiles, new Set(suitedAndHonorTileTypes));
        assertTilesSameValue(tiles);
        this.tiles = [...tiles];
        this.exposed = (exposed ? exposed : false);
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