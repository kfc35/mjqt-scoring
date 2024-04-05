import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";

export default class Kong extends Meld {
    constructor(tile: SuitedOrHonorTile, exposed: boolean = false) {
        assertTileSuitedOrHonor(tile);
        super([tile.copy(), tile.copy(), tile.copy(), tile.copy()], MeldType.KONG, exposed);
    }

    clone(exposedOverride? : boolean) {
        return new Kong(this._tiles[0], exposedOverride ?? this.exposed);
    }
}

export function meldIsKong(meld: Meld): meld is Kong {
    return meld.type == MeldType.KONG;
}