import { type SuitedOrHonorTile, suitedOrHonorTileGroups } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTilesHaveSameTypeAndValue } from "model/meld/meldUtils.js";

export default class Pair extends Meld {
    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile]) {
        assertTilesHaveSameTypeAndValue(tiles, suitedOrHonorTileGroups);
        super([...tiles], false);
    }

    getType(): MeldType.PAIR {
        return MeldType.PAIR
    }
}