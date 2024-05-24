import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { type FlowerTile } from "model/tile/group/flowerTile";
import Meld from "model/meld/meld";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { handMinLengthWithoutFlowers } from "model/hand/hk/handConstants";
import { assertTilesNotNullAndCorrectLength, assertTilesSuitedOrHonor, assertEachTileHasQuantityLTEMaxPerTile, assertTilesFlower, tilesUnique } from "common/tileUtils";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { SpecialWinningHandTileGroupValueMaps } from "model/hand/hk/winningHand/tileGroupValueMaps";

/** A SpecialWinningHand is a combination of tiles that does not fit the usual "meld" structure,
 * but still constitutes a win. 
 */
export class SpecialWinningHand implements WinningHand {
    private _tiles: SuitedOrHonorTile[][]; // [][] in case there is a user friendly way of grouping the tiles.
    private _winningTile: SuitedOrHonorTile;
    private _isSelfDrawn: boolean;
    private _tileGroupValueMaps: SpecialWinningHandTileGroupValueMaps;
    protected _flowerTiles: FlowerTile[];
    protected _specialWinningHandType: SpecialWinningHandType;

    // dups are allowed in tiles
    constructor(tiles: SuitedOrHonorTile[][], 
        winningTile: SuitedOrHonorTile, 
        isSelfDrawn: boolean, 
        flowerTiles: FlowerTile[],
        specialWinningHandType: SpecialWinningHandType) {
        const unwrappedTiles = tiles.reduce<SuitedOrHonorTile[]>((accum, tileArray) => accum.concat(tileArray), [])
        assertTilesNotNullAndCorrectLength(unwrappedTiles, handMinLengthWithoutFlowers, handMinLengthWithoutFlowers);
        assertTilesSuitedOrHonor(unwrappedTiles);
        assertEachTileHasQuantityLTEMaxPerTile(unwrappedTiles);
        
        this._tiles = tiles;
        this._tileGroupValueMaps = new SpecialWinningHandTileGroupValueMaps(this._tiles);
        this._winningTile = winningTile;
        assertTilesFlower(flowerTiles);
        if (!tilesUnique(flowerTiles)) {
            throw new Error("flowerTiles must be unique");
        }
        this._isSelfDrawn = isSelfDrawn;
        this._flowerTiles = flowerTiles;
        this._specialWinningHandType = specialWinningHandType;
    }

    getMelds(): ReadonlyArray<Meld> {
        return [];
    }

    getTiles(): SuitedOrHonorTile[][] {
        return this._tiles;
    }

    get tileGroupValueMaps(): SpecialWinningHandTileGroupValueMaps {
        return this._tileGroupValueMaps;
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

    get specialWinningHandType(): SpecialWinningHandType { 
        return this._specialWinningHandType;
    }

}