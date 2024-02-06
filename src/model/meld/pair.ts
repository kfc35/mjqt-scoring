import { type SuitedOrHonorTile, suitedOrHonorTileGroups } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTileHasGroup } from "model/meld/meldUtils";

export default class Pair extends Meld {
    constructor(tile: SuitedOrHonorTile) {
        assertTileHasGroup(tile, suitedOrHonorTileGroups);
        super([tile.copy() as SuitedOrHonorTile, 
            tile.copy() as SuitedOrHonorTile], false);
    }

    getType(): MeldType.PAIR {
        return MeldType.PAIR
    }
}