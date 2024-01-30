import { type SuitedOrHonorTile, suitedOrHonorTileGroups } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTilesHaveSameTypeAndValue } from "model/meld/meldUtils.js";

export default class Kong extends Meld {
    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile, 
        SuitedOrHonorTile], exposed?: boolean) {
        assertTilesHaveSameTypeAndValue(tiles, suitedOrHonorTileGroups);
        super([...tiles], exposed);
    }

    getType(): MeldType.KONG {
        return MeldType.KONG
    }
}