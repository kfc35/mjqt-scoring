import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Meld }  from "model/meld/meld";
import { MeldType } from "model/meld/meldType";
import { assertTileSuitedOrHonor } from "common/tileUtils";

export class Pong extends Meld {
    declare protected _tiles: [SuitedOrHonorTile, SuitedOrHonorTile, SuitedOrHonorTile];

    constructor(tile: SuitedOrHonorTile, exposed: boolean = false) {
        assertTileSuitedOrHonor(tile);
        super([tile.clone(), tile.clone(), tile.clone()], MeldType.PONG, exposed);
    }

    clone(exposedOverride? : boolean) {
        return new Pong(this._tiles[0], exposedOverride ?? this.exposed);
    }
}

export function meldIsPong(meld: Meld): meld is Pong {
    return meld.type == MeldType.PONG;
}