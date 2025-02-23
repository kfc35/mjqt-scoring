import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld from "model/meld/meld";

export class MostRecentTileContext {
    private _tile: SuitedOrHonorTile;
    // _userSpecifiedMeld can be undefined for special hands. in that case, the isSelfDrawn flag is used.
    private _userSpecifiedMeld: Meld | undefined;
    private _isSelfDrawn: boolean;
    
    constructor(tile: SuitedOrHonorTile, isSelfDrawn: boolean);
    constructor(tile: SuitedOrHonorTile, userSpecifiedMeld?: Meld);
    constructor(tile: SuitedOrHonorTile,
        isSelfDrawnOrUserSpecifiedMeld: boolean | Meld | undefined) {
            this._tile = tile;
            if (isSelfDrawnOrUserSpecifiedMeld instanceof Meld || isSelfDrawnOrUserSpecifiedMeld === undefined) {
                this._userSpecifiedMeld = isSelfDrawnOrUserSpecifiedMeld;
                this._isSelfDrawn = (!!this._userSpecifiedMeld ? !this._userSpecifiedMeld.exposed : false);
            } else {
                this._userSpecifiedMeld = undefined;
                this._isSelfDrawn = isSelfDrawnOrUserSpecifiedMeld;
            }
    }

    get tile() : SuitedOrHonorTile {
        return this._tile;
    }

    get isSelfDrawn() : boolean {
        return (!!this._userSpecifiedMeld ? !this._userSpecifiedMeld.exposed : this._isSelfDrawn);
    }

    get userSpecifiedMeld() : Meld | undefined {
        return this._userSpecifiedMeld;
    }
}