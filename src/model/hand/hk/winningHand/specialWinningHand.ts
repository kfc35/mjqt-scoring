import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { type FlowerTile } from "model/tile/group/flowerTile";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { handMinLengthWithoutFlowers } from "model/hand/hk/handConstants";
import { assertTilesNotNullAndCorrectLength, assertTilesSuitedOrHonor, assertEachTileHasQuantityLTEMaxPerTile, assertTilesFlower, tilesUnique } from "common/tileUtils";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { SpecialWinningHandTileGroupValueMaps } from "model/hand/hk/winningHand/tileGroupValueMaps";
import { tilesDoesNotContainTile } from "common/tileUtils";
import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";

/** A SpecialWinningHand is a combination of tiles that does not fit the usual "meld" structure,
 * but still constitutes a win. Every tile besides the last tile MUST have been received via self draw. */
export class SpecialWinningHand implements WinningHand {
    private _tiles: SuitedOrHonorTile[][]; // [][] because the tiles are organized into subgroups.
    private _tilesIndexWithWinningTile: number;
    private _winningTile: SuitedOrHonorTile;
    private _winningTileIsPartOfPair: boolean;
    private _isSelfDrawn: boolean;
    private _tileGroupValueMaps: SpecialWinningHandTileGroupValueMaps;
    protected _flowerTiles: FlowerTile[];
    protected _specialWinningHandType: SpecialWinningHandType;

    // dups are allowed in tiles
    constructor(tiles: SuitedOrHonorTile[][], 
        tilesIndexWithWinningTile: number,
        winningTile: SuitedOrHonorTile, 
        winningTileIsPartOfPair: boolean,
        isSelfDrawn: boolean, 
        flowerTiles: FlowerTile[],
        specialWinningHandType: SpecialWinningHandType) {
        const unwrappedTiles = tiles.reduce<SuitedOrHonorTile[]>((accum, tileArray) => accum.concat(tileArray), [])
        assertTilesNotNullAndCorrectLength(unwrappedTiles, handMinLengthWithoutFlowers, handMinLengthWithoutFlowers);
        assertTilesSuitedOrHonor(unwrappedTiles);
        assertEachTileHasQuantityLTEMaxPerTile(unwrappedTiles);
        if (tilesIndexWithWinningTile < 0 || tilesIndexWithWinningTile >= tiles.length) {
            throw new Error(`tilesIndexWithWinningTile must be between 0 and ${tiles.length - 1}`);
        }
        const tilesWithWinningTile = tiles[tilesIndexWithWinningTile];
        if (!tilesWithWinningTile) {
            throw new Error(`tiles at tilesIndexWithWinningTile (${tilesIndexWithWinningTile}) must be defined`);
        }
        if (tilesDoesNotContainTile(tilesWithWinningTile, winningTile)) {
            throw new Error(`tiles at tilesIndexWithWinningTile (${tilesIndexWithWinningTile}) must contain the specified winning tile`);
        }
        
        this._tiles = tiles;
        this._tilesIndexWithWinningTile = tilesIndexWithWinningTile;
        this._tileGroupValueMaps = new SpecialWinningHandTileGroupValueMaps(this._tiles);
        this._winningTile = winningTile;
        this._winningTileIsPartOfPair = winningTileIsPartOfPair;
        assertTilesFlower(flowerTiles);
        if (!tilesUnique(flowerTiles)) {
            throw new Error("flowerTiles must be unique");
        }
        this._isSelfDrawn = isSelfDrawn;
        this._flowerTiles = flowerTiles;
        this._specialWinningHandType = specialWinningHandType;
    }

    get tiles(): ReadonlyArray<ReadonlyArray<SuitedOrHonorTile>>  {
        return this._tiles;
    }

    get tilesIndexWithWinningTile(): number {
        return this._tilesIndexWithWinningTile;
    }

    get tileGroupValueMaps(): SpecialWinningHandTileGroupValueMaps {
        return this._tileGroupValueMaps;
    }

    get winningTile() : SuitedOrHonorTile {
        return this._winningTile;
    }

    get winningTileIsPartOfPair(): boolean {
        return this._winningTileIsPartOfPair;
    }

    get flowerTiles() : FlowerTile[] {
        return this._flowerTiles;
    }

    isSelfDrawn() : boolean {
        return this._isSelfDrawn;
    }

    toHand() : Hand {
        return new Hand(this._tiles.reduce<SuitedOrHonorTile[]>((accum, tiles) => accum.concat(tiles), []), 
                    new MostRecentTileContext(this.winningTile, this.isSelfDrawn()));
    }

    get specialWinningHandType(): SpecialWinningHandType { 
        return this._specialWinningHandType;
    }

}