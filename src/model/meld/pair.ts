import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";

/**
 * Pairs can only be marked as "exposed" if they are completed via discard as your last set.
 */
export default class Pair extends Meld {
    declare protected _tiles: [SuitedOrHonorTile, SuitedOrHonorTile];

    constructor(tile: SuitedOrHonorTile, exposed : boolean = false) {
        assertTileSuitedOrHonor(tile);
        super([tile.copy(), tile.copy()], MeldType.PAIR, exposed);
    }

    clone(exposedOverride? : boolean) {
        return new Pair(this._tiles[0], exposedOverride ?? this.exposed);
    }
}

export function meldIsPair(meld: Meld): meld is Pair {
    return meld.type === MeldType.PAIR;
}