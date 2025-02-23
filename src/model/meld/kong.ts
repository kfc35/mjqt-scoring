import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";

export default class Kong extends Meld {
    declare protected _tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile];

    constructor(tile: SuitedOrHonorTile, exposed: boolean = false) {
        assertTileSuitedOrHonor(tile);
        super([tile.clone(), tile.clone(), tile.clone(), tile.clone()], MeldType.KONG, exposed);
    }

    clone(exposedOverride? : boolean) {
        return new Kong(this._tiles[0], exposedOverride ?? this.exposed);
    }
}

export function meldIsKong(meld: Meld): meld is Kong {
    return meld.type == MeldType.KONG;
}