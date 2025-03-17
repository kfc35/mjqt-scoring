import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { Meld } from "model/meld/meld";
import { meldIsKong } from "model/meld/kong";
import { type FlowerTile } from "model/tile/group/flowerTile";
import { assertTilesFlower, tilesUnique, assertEachTileHasQuantityLTEMaxPerTile, assertTilesNotNullAndCorrectLength, assertTilesSuitedOrHonor } from "common/tileUtils";
import { getMeldAtIndex, meldHasTile, meldToFlatTiles } from "common/meldUtils";
import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { handMinLengthWithoutFlowers, handMaxLengthWithoutFlowers } from "model/hand/hk/handConstants";
import { meldIsPair } from "model/meld/pair";
import { MeldBasedWinningHandTileGroupValueMaps } from "model/hand/hk/winningHand/tileGroupValueMaps";

/** A MeldBasedWinningHand is a Hand that has been processed completely into finished melds.
 * A hand can have multiple MeldBasedWinningHands depending on the arrangement of the melds.
 * Seven pairs counts as a MeldBasedWinningHand (with _melds.length = 7)
*/
export class MeldBasedWinningHand implements WinningHand {
    private _melds: ReadonlyArray<Meld>; // meld indices are important for point reporting, hence reao
    private _meldWithWinningTileIndex: number;
    private _meldWithWinningTile: Meld; // for easy access
    private _winningTile: SuitedOrHonorTile;
    private _tileGroupValueMaps: MeldBasedWinningHandTileGroupValueMaps;
    protected _flowerTiles: FlowerTile[];

    constructor(melds: Meld[], meldWithWinningTileIndex: number, winningTile: SuitedOrHonorTile, flowerTiles: FlowerTile[]) {
        const tiles: SuitedOrHonorTile[] = meldToFlatTiles(melds);
        assertTilesNotNullAndCorrectLength(tiles, handMinLengthWithoutFlowers, handMaxLengthWithoutFlowers);
        assertTilesSuitedOrHonor(tiles);
        assertEachTileHasQuantityLTEMaxPerTile(tiles);
        if (meldWithWinningTileIndex < 0 || meldWithWinningTileIndex >= melds.length) {
            throw new Error(`meldWithWinningTileIndex must be between 0 and ${melds.length - 1}`);
        }
        this._melds = melds;
        if (this._melds.length !== 5 && this._melds.length !== 7) {
            throw new Error("melds must be of length 5 or 7");
        }
        // assert melds of size 7 means all melds are pairs.
        if (this._melds.length === 7 && this._melds.filter(meld => meldIsPair(meld)).length !== 7) {
            throw new Error("melds of length 7 must be all pairs.");
        }
        if (this._melds.length === 7 && this._melds.filter(meld => meld.exposed).length > 1) {
            throw new Error("a seven pairs winning hand cannot have more than one meld be exposed.");
        }
        // assert melds of size 5 have only one pair
        if (this._melds.length === 5 && this._melds.filter(meld => meldIsPair(meld)).length !== 1) {
            throw new Error("melds of length 5 must have exactly one pair.");
        }

        this._meldWithWinningTileIndex = meldWithWinningTileIndex;
        const meldWithWinningTile = getMeldAtIndex(melds, meldWithWinningTileIndex);
        if (!meldHasTile(meldWithWinningTile, winningTile)) {
            throw new Error("winningTile must be in meldWithWinningTile");
        }
        if (meldIsKong(meldWithWinningTile)) {
            throw new Error("The meld with a winning tile cannot be a kong");
        }
        this._meldWithWinningTile = meldWithWinningTile;
        this._winningTile = winningTile;

        assertTilesFlower(flowerTiles);
        if (!tilesUnique(flowerTiles)) {
            throw new Error("flowerTiles must be unique");
        }
        this._flowerTiles = flowerTiles;

        this._tileGroupValueMaps = new MeldBasedWinningHandTileGroupValueMaps(this._melds);
    }

    get tiles(): ReadonlyArray<ReadonlyArray<SuitedOrHonorTile>> {
        return this._melds.map(meld => meld.tiles);
    }

    get tilesIndexWithWinningTile(): number {
        return this._meldWithWinningTileIndex; // tiles() is melds mapped to each meld's tiles with the same outer ordering.
    }

    get tileGroupValueMaps(): MeldBasedWinningHandTileGroupValueMaps {
        return this._tileGroupValueMaps;
    }

    get winningTile(): SuitedOrHonorTile {
        return this._winningTile;
    }

    get winningTileIsPartOfPair(): boolean {
        return meldIsPair(this._meldWithWinningTile);
    }

    get flowerTiles() : FlowerTile[] {
        return this._flowerTiles;
    }

    isSelfDrawn() : boolean {
        return !this._meldWithWinningTile.exposed;
    }

    /** Meld specific functions 8*/

    get melds(): ReadonlyArray<Meld> {
        return this._melds;
    }

    get meldWithWinningTileIndex(): number {
        return this._meldWithWinningTileIndex;
    }

    get meldWithWinningTile(): Meld {
        return this._meldWithWinningTile;
    }
}