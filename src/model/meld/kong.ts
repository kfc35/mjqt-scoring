import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertIsSuitedOrHonor } from "model/meld/meldUtils";

export default class Kong extends Meld {
    constructor(tile: SuitedOrHonorTile, exposed?: boolean) {
        assertIsSuitedOrHonor(tile);
        super([tile.copy(), tile.copy(), tile.copy(), tile.copy()], exposed);
    }

    getType(): MeldType.KONG {
        return MeldType.KONG
    }
}