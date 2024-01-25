import { SuitedOrHonorTile, suitedAndHonorTileTypes } from "model/tile/tile.js";
import { Meld, MeldType } from "model/meld/meld.js";
import { assertTilesHaveSameTypeAndValue } from "model/meld/meldUtils.js";

export class Pair extends Meld {
    private meldType: MeldType = MeldType.PAIR;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile]) {
        assertTilesHaveSameTypeAndValue(tiles, suitedAndHonorTileTypes);
        super([...tiles], false);
    }

    getType(): MeldType {
        return this.meldType;
    }
}