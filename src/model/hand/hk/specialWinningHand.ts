import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { type FlowerTile } from "model/tile/group/flowerTile";
import Pair from "model/meld/pair";
import { WinningHand } from "model/hand/hk/winningHand";
import { handMinLength } from "model/hand/hk/handConstants";
import { assertTilesNotNullAndCorrectLength, assertTilesSuitedOrHonor, assertTilesFlower, tilesUnique } from "common/tileUtils";

/** A SpecialWinningHand is a combination of tiles that does not fit the "meld" structure,
 * but still constitutes a win. E.g. Thirteen Orphans (13 arbitrary tiles plus a duplicate tile.)
 * One can specify 14 specific tiles, in which case the pair will be undefined.
 */
export class SpecialWinningHand implements WinningHand {
    tiles: SuitedOrHonorTile[];
    flowerTiles: FlowerTile[];
    pair?: Pair | undefined;

    // dups are allowed in tiles
    constructor(thirteenOrFourteenTiles: SuitedOrHonorTile[], flowerTiles: FlowerTile[], pair?: Pair) {
        if (pair) {
            assertTilesNotNullAndCorrectLength(thirteenOrFourteenTiles, handMinLength - 1, handMinLength - 1)
        } else {
            assertTilesNotNullAndCorrectLength(thirteenOrFourteenTiles, handMinLength, handMinLength)
        }
        assertTilesSuitedOrHonor(thirteenOrFourteenTiles);
        // TODO assert max 4 of each suited or honor tile.
        this.tiles = thirteenOrFourteenTiles;

        assertTilesFlower(flowerTiles);
        if (!tilesUnique(flowerTiles)) {
            throw new Error("flowerTiles must be unique");
        }
        this.flowerTiles = flowerTiles;
        this.pair = pair;
    }

    analyzeWinningHandForFaan(analyzer: (winningHand: WinningHand) => void) : this {
        analyzer(this);
        return this;
    }
}