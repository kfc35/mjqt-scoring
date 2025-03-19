import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Meld }  from "model/meld/meld";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";
import { isSuitedTile, SuitedTile } from "model/tile/group/suitedTile";
import { HonorTile } from "model/tile/group/honorTile";

export class Kong extends Meld {
    declare protected _tiles: [SuitedTile, SuitedTile, SuitedTile, SuitedTile] | [HonorTile, HonorTile, HonorTile, HonorTile];

    constructor(tile: SuitedOrHonorTile, exposed: boolean = false) {
        assertTileSuitedOrHonor(tile);
        if (isSuitedTile(tile)) { // in order to separate Suited and Honor tiles
            super([tile.clone(), tile.clone(), tile.clone(), tile.clone()], MeldType.KONG, exposed);
        } else {
            super([tile.clone(), tile.clone(), tile.clone(), tile.clone()], MeldType.KONG, exposed);
        }
    }

    clone(exposedOverride? : boolean) {
        return new Kong(this._tiles[0], exposedOverride ?? this.exposed);
    }

    override toString(): string {
        const exposedPrefix = (this._exposed ? "Exposed" : "Self-Drawn");
        return `${exposedPrefix} Kong(${this._tiles[0].toString()}, ${this._tiles[1].toString()}, ${this._tiles[2].toString()}, ${this._tiles[3].toString()})`;
    }
}

export function meldIsKong(meld: Meld): meld is Kong {
    return meld.type == MeldType.KONG;
}