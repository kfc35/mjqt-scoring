import { WinningHand } from "model/hand/hk/winningHand";
import Meld from "model/meld/meld";
import { type FlowerTile } from "model/tile/group/flowerTile";
import { assertTilesFlower, tilesUnique } from "common/tileUtils";

/** A StandardWinningHand is a Hand that has been successfully analyzed to be a complete winning hand. i.e. processed into melds. 
 * A hand can have multipe standard winning hands depending on the arrangement of the melds.
 * Seven pairs counts as a standard winning hand.
*/
export class StandardWinningHand implements WinningHand {
    private melds: Meld[];
    protected _flowerTiles: FlowerTile[];
    // map from faan to "explanation", could be a single meld, multiple melds, individual tiles, whole hand, actions unrelated to your hand

    constructor(melds: Meld[], flowerTiles: FlowerTile[]) {
        // assert each tile is not null
        // must have at least 14 non bonus tiles.
        // each individual mahjong tile can only appear max 4 times.
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands.
        this.melds = melds!;

        assertTilesFlower(flowerTiles);
        if (!tilesUnique(flowerTiles)) {
            throw new Error("flowerTiles must be unique");
        }
        this._flowerTiles = flowerTiles;
    }

    analyzeWinningHandForFaan(analyzer: (winningHand: WinningHand) => void) : this {
        analyzer(this);
        return this;
    }

    get flowerTiles() : FlowerTile[] {
        return this._flowerTiles;
    }

    getContents(): Meld[] {
        return this.melds;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
}

