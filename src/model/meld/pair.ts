import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertIsSuitedOrHonor } from "model/meld/meldUtils";

export default class Pair extends Meld {
    constructor(tile: SuitedOrHonorTile) {
        assertIsSuitedOrHonor(tile);
        super([tile.copy(), tile.copy()], false);
    }

    getType(): MeldType.PAIR {
        return MeldType.PAIR
    }
}