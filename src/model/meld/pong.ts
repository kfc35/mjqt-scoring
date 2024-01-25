import { SuitedOrHonorTile } from "model/tile/tile.js";
import { Meld, MeldType } from "model/meld/meld.js";
import { suitedAndHonorTileTypes, assertTilesHaveSameTypeAndValue } from "model/meld/meldUtils.js";

export class Pong extends Meld {
    private meldType: MeldType = MeldType.PONG;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile], 
        exposed?: boolean) {
        assertTilesHaveSameTypeAndValue(tiles, suitedAndHonorTileTypes);
        super([...tiles], exposed);
    }

    getType(): MeldType {
        return this.meldType;
    }
}