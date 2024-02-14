import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";

export default class Pair extends Meld {
    constructor(tile: SuitedOrHonorTile) {
        assertTileSuitedOrHonor(tile);
        super([tile.copy(), tile.copy()], MeldType.PAIR, false);
    }
}