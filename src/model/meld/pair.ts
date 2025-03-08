import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Meld }  from "model/meld/meld";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";

/**
 * Pairs can only be marked as "exposed" if they are completed via discard as your last meld.
 */
export class Pair extends Meld {
    declare protected _tiles: [SuitedOrHonorTile, SuitedOrHonorTile];

    constructor(tile: SuitedOrHonorTile, exposed : boolean = false) {
        assertTileSuitedOrHonor(tile);
        super([tile.clone(), tile.clone()], MeldType.PAIR, exposed);
    }

    clone(exposedOverride? : boolean) {
        return new Pair(this._tiles[0], exposedOverride ?? this.exposed);
    }

    override toString(): string {
        const exposedPrefix = (this._exposed ? "Exposed" : "Self-Drawn");
        return `${exposedPrefix} Pair(${this._tiles[0]}, ${this._tiles[1]})`;
    }
}

export function meldIsPair(meld: Meld): meld is Pair {
    return meld.type === MeldType.PAIR;
}