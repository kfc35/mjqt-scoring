import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { type FlowerTile } from "model/tile/hk/hongKongTile";
import Pair from "model/meld/pair";
import { WinningHand } from "model/hand/hk/winningHand";

/** A SpecialWinningHand is a combination of tiles that does not fit the "meld" structure,
 * but still constitutes a win. E.g. Thirteen Orphans (13 specific tiles plus a duplicate tile.)
 * One could specify 14 specific tiles, in which case the pair will be undefined.
 */
export class SpecialWinningHand implements WinningHand {
    tiles: SuitedOrHonorTile[];
    flowerTiles: FlowerTile[];
    pair?: Pair | undefined;

    constructor(tiles: SuitedOrHonorTile[], flowerTiles: FlowerTile[], pair?: Pair) {
        if (pair) {
            // assert tiles length 13
        } else {
            // assert tiles length 14
        }
        // assert each tile is not null
        // must have at least 14 non flower tiles. need to check it cause of js weirdness
        // each individual mahjong tile can only appear max 4 times.
        this.tiles = tiles;
        this.flowerTiles = flowerTiles;
        this.pair = pair;
    }

    analyzeWinningHandForFaan(analyzer: (winningHand: WinningHand) => void) : this {
        analyzer(this);
        return this;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
}