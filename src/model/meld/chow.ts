import SuitedTile from "model/tile/group/suitedTile";
import Meld  from "model/meld/meld.js";
import { MeldType } from "model/meld/meldType";
import { assertTilesHaveSameSuitedGroup } from "common/tileUtils";

export default class Chow extends Meld {
    // Chow's must be Suited Tiles because it is the only group to have the notion of "consecutivity"
    declare protected _tiles: SuitedTile[];

    constructor(tiles: [SuitedTile, SuitedTile, SuitedTile], exposed?: boolean) {
        assertTilesHaveSameSuitedGroup(tiles);
        
        const tilesCopy : [SuitedTile, SuitedTile, SuitedTile] = [tiles[0].copy(), tiles[1].copy(), tiles[2].copy()];
        tilesCopy.sort(function(tile1: SuitedTile, tile2: SuitedTile){
            return tile1.compareTo(tile2);
        });
        if (!tilesCopy[0].isOneBefore(tilesCopy[1])
            || !tilesCopy[1].isOneBefore(tilesCopy[2])) {
            throw new TypeError("Tiles in a Chow must be a consecutive run (e.g. 1,2,3 or 2,3,4 ... or 7,8,9).");
        }

        super(tilesCopy, MeldType.CHOW, exposed);
    }
}