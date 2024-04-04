import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { type FlowerTile } from "model/tile/group/flowerTile";
import Meld from "model/meld/meld";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { handMinLengthWithoutFlowers } from "model/hand/hk/handConstants";
import { assertTilesNotNullAndCorrectLength, assertTilesSuitedOrHonor, assertEachTileHasQuantityLessThanMaxPerTile, assertTilesFlower, tilesUnique } from "common/tileUtils";

/** A SpecialWinningHand is a combination of tiles that does not fit the "meld" structure,
 * but still constitutes a win. E.g. Thirteen Orphans (13 arbitrary tiles plus a duplicate tile.)
 */
export class SpecialWinningHand implements WinningHand {
    private _tiles: SuitedOrHonorTile[][]; // [][] in case there is a user friendly way of grouping the tiles.
    private _winningTile: SuitedOrHonorTile;
    private _isSelfDrawn: boolean;
    protected _flowerTiles: FlowerTile[];

    // dups are allowed in tiles
    constructor(tiles: SuitedOrHonorTile[][], winningTile: SuitedOrHonorTile, isSelfDrawn: boolean, flowerTiles: FlowerTile[]) {
        const unwrappedTiles = tiles.reduce<SuitedOrHonorTile[]>((accum, tileArray) => accum.concat(tileArray), [])
        assertTilesNotNullAndCorrectLength(unwrappedTiles, handMinLengthWithoutFlowers, handMinLengthWithoutFlowers);
        assertTilesSuitedOrHonor(unwrappedTiles);
        assertEachTileHasQuantityLessThanMaxPerTile(unwrappedTiles);
        
        this._tiles = tiles;
        this._winningTile = winningTile;
        assertTilesFlower(flowerTiles);
        if (!tilesUnique(flowerTiles)) {
            throw new Error("flowerTiles must be unique");
        }
        this._isSelfDrawn = isSelfDrawn;
        this._flowerTiles = flowerTiles;
    }

    getContents(): SuitedOrHonorTile[][] {
        return this._tiles;
    }

    get meldWithWinningTile() : Meld | undefined {
        return undefined;
    }

    get winningTile() : SuitedOrHonorTile {
        return this._winningTile;
    }

    get flowerTiles() : FlowerTile[] {
        return this._flowerTiles;
    }

    isSelfDrawn() : boolean {
        return this._isSelfDrawn;
    }

}