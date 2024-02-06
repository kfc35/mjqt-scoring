import SuitedTile from "model/tile/group/suitedTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { suitedTileGroups } from "model/tile/group/suitedTile";
import { assertTilesHaveSameType } from "model/meld/meldUtils.js";

export default class Chow extends Meld {
    // Chow's must be Suited Tiles because it is the only group to have the notion of "consecutivity"
    declare protected _tiles: SuitedTile[];

    constructor(tiles: [SuitedTile, SuitedTile, SuitedTile], 
        exposed?: boolean) {
        assertTilesHaveSameType(tiles, suitedTileGroups);
        
        // Ascending order. Shallow copy is ok here since tiles are immutable.
        const tilesShallowCopy : [SuitedTile, SuitedTile, SuitedTile] = [...tiles];
        tilesShallowCopy.sort(function(tile1: SuitedTile, tile2: SuitedTile){
            return tile1.compareTo(tile2);
        });
        if (!tilesShallowCopy[0].isOneBefore(tilesShallowCopy[1])
            || !tilesShallowCopy[1].isOneBefore(tilesShallowCopy[2])) {
            throw new TypeError("Tiles in a Chow must be a consecutive run (e.g. 1,2,3 or 2,3,4 ... or 7,8,9).");
        }

        super(tilesShallowCopy, exposed);
    }

    getType(): MeldType.CHOW {
        return MeldType.CHOW;
    }
}