import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Meld }  from "model/meld/meld";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";
import { isSuitedTile } from "model/tile/group/suitedTile";
import { SuitedTile } from "model/tile/group/suitedTile";
import { HonorTile } from "model/tile/group/honorTile";

/**
 * Pairs can only be marked as "exposed" if they are completed via discard as your last meld.
 */
export class Pair extends Meld {
    declare protected _tiles: [SuitedTile, SuitedTile] | [HonorTile, HonorTile];

    constructor(tile: SuitedOrHonorTile, exposed : boolean = false) {
        assertTileSuitedOrHonor(tile);
        
        if (isSuitedTile(tile)) { // in order to separate Suited and Honor tiles
            super([tile.clone(), tile.clone()], MeldType.PAIR, exposed);
        } else {
            super([tile.clone(), tile.clone()], MeldType.PAIR, exposed);
        }
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