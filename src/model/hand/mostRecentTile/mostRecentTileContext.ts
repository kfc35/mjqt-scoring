import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld from "model/meld/meld";

export class MostRecentTileContext {
    private _tile: SuitedOrHonorTile;
    // _userSpecifiedMeld can be undefined for special hands, even if self drawn is false
    // one MAY define a most recent tile where _isSelfDrawn = false and the userSpecifiedMeld = undefined
    // in this case, the eaten tile will be used to convert an existing unexposed meld to an exposed one.
    private _userSpecifiedMeld: Meld | undefined;

    constructor(tile: SuitedOrHonorTile,
        userSpecifiedMeld: Meld | undefined) {
            this._tile = tile;
            this._userSpecifiedMeld = userSpecifiedMeld;
    }

    get tile() : SuitedOrHonorTile {
        return this._tile;
    }

    get isSelfDrawn() : boolean {
        return !this._userSpecifiedMeld || !this._userSpecifiedMeld.exposed;
    }

    get userSpecifiedMeld() : Meld | undefined {
        return this._userSpecifiedMeld;
    }
}