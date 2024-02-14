import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { type FlowerTile } from "model/tile/hk/hongKongTile";
import Pair from "model/meld/pair";

/** A SpecialWinningHand is a combination of tiles that does not fit the "meld" structure,
 * but still constitutes a win. E.g. Thirteen Orphans (13 specific tiles plus a duplicate tile.)
 */
export class SpecialWinningHand {
    tiles: SuitedOrHonorTile[];
    flowerTiles: FlowerTile[];
    pair?: Pair | undefined;

    constructor(tiles: SuitedOrHonorTile[], flowerTiles: FlowerTile[], pair?: Pair) {
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