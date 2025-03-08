import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Meld }  from "model/meld/meld";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";

export class Kong extends Meld {
    declare protected _tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile];

    constructor(tile: SuitedOrHonorTile, exposed: boolean = false) {
        assertTileSuitedOrHonor(tile);
        super([tile.clone(), tile.clone(), tile.clone(), tile.clone()], MeldType.KONG, exposed);
    }

    clone(exposedOverride? : boolean) {
        return new Kong(this._tiles[0], exposedOverride ?? this.exposed);
    }

    override toString(): string {
        const exposedPrefix = (this._exposed ? "Exposed" : "Self-Drawn");
        return `${exposedPrefix} Kong(${this._tiles[0]}, ${this._tiles[1]}, ${this._tiles[2]}, ${this._tiles[3]})`;
    }
}

export function meldIsKong(meld: Meld): meld is Kong {
    return meld.type == MeldType.KONG;
}