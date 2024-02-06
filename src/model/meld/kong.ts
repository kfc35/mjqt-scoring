import { type SuitedOrHonorTile, suitedOrHonorTileGroups } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTileHasGroup } from "model/meld/meldUtils";

export default class Kong extends Meld {
    constructor(tile: SuitedOrHonorTile, exposed?: boolean) {
        assertTileHasGroup(tile, suitedOrHonorTileGroups);
        super([tile.copy() as SuitedOrHonorTile,
            tile.copy() as SuitedOrHonorTile,
            tile.copy() as SuitedOrHonorTile,
            tile.copy() as SuitedOrHonorTile], exposed);
    }

    getType(): MeldType.KONG {
        return MeldType.KONG
    }
}