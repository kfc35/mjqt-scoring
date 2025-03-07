import { SuitedTile } from "model/tile/group/suitedTile";
import { Meld }   from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { compareTilesByValueOnly } from "model/tile/tile";

export class Chow extends Meld {
    // Chow's must be Suited Tiles because it is the only group to have the notion of "consecutivity"
    declare protected _tiles: [SuitedTile, SuitedTile, SuitedTile];

    constructor(tiles: [SuitedTile, SuitedTile, SuitedTile], exposed: boolean = false) {
        if (!(tiles[0].group === tiles[1].group && tiles[1].group === tiles[2].group && tiles[0].group === tiles[2].group) || 
        !(tiles[0].group !== tiles[1].group && tiles[1].group !== tiles[2].group && tiles[0].group !== tiles[2].group))  {
            throw new Error('A chow must be either all the same suit or knitted (all different suites)');
        }
        
        const tilesCopy : [SuitedTile, SuitedTile, SuitedTile] = [tiles[0].clone(), tiles[1].clone(), tiles[2].clone()];
        tilesCopy.sort(compareTilesByValueOnly);
        if (!tilesCopy[0].isOneBefore(tilesCopy[1])
            || !tilesCopy[1].isOneBefore(tilesCopy[2])) {
            throw new TypeError("Tiles in a Chow must be a consecutive run (e.g. 1,2,3 or 2,3,4 ... or 7,8,9).");
        }

        super(tilesCopy, MeldType.CHOW, exposed);
    }

    clone(exposedOverride? : boolean) {
        return new Chow(this._tiles, exposedOverride ?? this.exposed);
    }

    isKnitted() : boolean {
        return this._tiles[0].group !== this._tiles[1].group && this._tiles[1].group !== this._tiles[2].group 
        && this._tiles[0].group !== this._tiles[2].group;
    }

    isSameSuit() : boolean {
        return !this.isKnitted(); // can only be knitted or all the same suit by assertion in the constructor.
    }

    override get tiles(): [SuitedTile, SuitedTile, SuitedTile] {
        return this._tiles;
    }
}

export function meldIsChow(meld: Meld): meld is Chow {
    return meld.type == MeldType.CHOW;
}