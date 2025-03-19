import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Meld }  from "model/meld/meld";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";
import { SuitedTile } from "model/tile/group/suitedTile";
import { HonorTile } from "model/tile/group/honorTile";
import { isSuitedTile } from "model/tile/group/suitedTile";

export class Pong extends Meld {
    declare protected _tiles: [SuitedTile, SuitedTile, SuitedTile] | [HonorTile, HonorTile, HonorTile];

    constructor(tile: SuitedOrHonorTile, exposed: boolean = false) {
        assertTileSuitedOrHonor(tile);
        if (isSuitedTile(tile)) { // in order to separate Suited and Honor tiles
            super([tile.clone(), tile.clone(), tile.clone()], MeldType.PONG, exposed);
        } else {
            super([tile.clone(), tile.clone(), tile.clone()], MeldType.PONG, exposed);
        }
    }

    clone(exposedOverride? : boolean) {
        return new Pong(this._tiles[0], exposedOverride ?? this.exposed);
    }

    override toString(): string {
        const exposedPrefix = (this._exposed ? "Exposed" : "Self-Drawn");
        return `${exposedPrefix} Pong(${this._tiles[0].toString()}, ${this._tiles[1].toString()}, ${this._tiles[2].toString()})`;
    }
}

export function meldIsPong(meld: Meld): meld is Pong {
    return meld.type == MeldType.PONG;
}