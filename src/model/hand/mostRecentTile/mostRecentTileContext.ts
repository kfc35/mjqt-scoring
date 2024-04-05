import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld from "model/meld/meld";

export class MostRecentTileContext {
    private _tile: SuitedOrHonorTile;
    private _isSelfDrawn: boolean;
    // _userSpecifiedMeld can be undefined for special hands, even if self drawn is false
    // one MAY define a most recent tile where _isSelfDrawn = false and the userSpecifiedMeld = undefined
    // in this case, the discard tile will be used to convert an unexposed meld to an exposed one.
    private _userSpecifiedMeld: Meld | undefined;

    constructor(tile: SuitedOrHonorTile, 
        isSelfDrawn: boolean, 
        userSpecifiedMeld: Meld | undefined) {
            if (isSelfDrawn && !!userSpecifiedMeld && userSpecifiedMeld.exposed) {
                throw new Error(`A self drawn most recent tile cannot be part of an exposed meld.`)
            }
            if (!isSelfDrawn && !!userSpecifiedMeld && !userSpecifiedMeld.exposed) {
                throw new Error(`A most recent tile gained via discard cannot be part of a unexposed meld.`)
            }
            this._tile = tile;
            this._isSelfDrawn = isSelfDrawn;
            this._userSpecifiedMeld = userSpecifiedMeld;
    }

    get tile() : SuitedOrHonorTile {
        return this._tile;
    }

    get isSelfDrawn() : boolean {
        return this._isSelfDrawn;
    }

    get userSpecifiedMeld() : Meld | undefined {
        return this._userSpecifiedMeld;
    }
}