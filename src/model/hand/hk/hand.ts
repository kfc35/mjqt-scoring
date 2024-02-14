import { assertTilesNotNullAndCorrectLength } from "common/tileUtils";
import { Tile } from "model/tile/tile";
import { type FlowerTile, flowerTileGroups, type HongKongTile } from "model/tile/hk/hongKongTile";
import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { WinningHand } from "model/hand/hk/winningHand";
import { TileToQuantityMap } from "model/hand/hk/tileQuantityMap";
import { handMinLength, handMaxLength, handMaxNumUniqueFlowers } from "model/hand/hk/handUtils";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { TileGroup } from "model/tile/tileGroup";
import { type TileValue } from "model/tile/tileValue";

/** A Hand is an unsorted collection of Mahjong Tiles during play.
 * It represents an instance when it is the player's turn (i.e. there are a minimum of 14 tiles instead of 13.)
 * It may or may not represent a winning hand. */
export class Hand {
    private _tileToQuantity: TileToQuantityMap;
    private _winningHands: WinningHand[];
    private _flowerTiles: FlowerTile[];

    constructor(tiles: HongKongTile[]) {
        assertTilesNotNullAndCorrectLength(tiles, handMinLength, handMaxLength);
        this._flowerTiles = tiles.filter(tile => flowerTileGroups.has(tile.group)) as FlowerTile[];
        if (this._flowerTiles.reduce((hasDup, tile, index) => 
            index + 1 >= this._flowerTiles.length ? hasDup : hasDup || tile.equals(this._flowerTiles[index+1]!), false)) {
            throw new TypeError("A HK Hand cannot have duplicate flower tiles.");
        }
        if (this._flowerTiles.length > handMaxNumUniqueFlowers) {
            throw new TypeError("A HK Hand can only have max " + handMaxNumUniqueFlowers + " number of flower tiles. Found " + this._flowerTiles.length);
        }
        
        const nonFlowerTiles : SuitedOrHonorTile[] = tiles.filter(tile => !flowerTileGroups.has(tile.group)) as SuitedOrHonorTile[];
        if (nonFlowerTiles.length < handMinLength) {
            throw new TypeError("A HK Hand must have at least " + handMinLength + " non flower tiles. Found " + nonFlowerTiles.length);
        }

        const tileToQuantity : TileToQuantityMap = new TileToQuantityMap(tiles);
        const quantityPerUniqueTile : number[] = tileToQuantity.getQuantityPerUniqueTile();
        const everyTileQuantityLessThanMaxUniqueTilePerHand = quantityPerUniqueTile.every(quantity => quantity < maxQuantityPerNonFlowerTile);
        if (!everyTileQuantityLessThanMaxUniqueTilePerHand) {
            throw new TypeError("A Hand can only have max " + maxQuantityPerNonFlowerTile + " of each unique suited or honor tile.");
        }
        
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands. 7 pairs can have a kong as two pairs.
        this._tileToQuantity = tileToQuantity;
        this._winningHands = [];
    }

    get tileToQuantity() {
        return this._tileToQuantity;
    }

    getQuantity(tile: Tile) : number;
    getQuantity(group: TileGroup, value: TileValue) : number;
    getQuantity(tileOrGroup: Tile | TileGroup, valueArg?: TileValue) : number {
        if (tileOrGroup instanceof Tile) {
            return this._tileToQuantity.getQuantity(tileOrGroup);
        } else if (!valueArg) {
            throw new Error("value cannot be null or undefined");
        } else {
            return this._tileToQuantity.getQuantity(tileOrGroup, valueArg);
        }
    }

    getQuantityPerUniqueTile(includeFlowerTiles?: boolean): number[] {
        return this._tileToQuantity.getQuantityPerUniqueTile(includeFlowerTiles);
    }

    getTotalQuantity(includeFlowerTiles?: boolean) : number {
        return this._tileToQuantity.getTotalQuantity(includeFlowerTiles);
    }

    getQuantityToTileMap(includeFlowerTiles?: boolean) : ReadonlyMap<number, Tile[]> {
        return this._tileToQuantity.getQuantityToTileMap(includeFlowerTiles);
    }

    get winningHands() {
        return this._winningHands;
    }

    get flowerTiles() {
        return this._flowerTiles;
    }

    // returning "this" allows for chaining multiple analyzers.
    analyzeHandForWinCondition(analyzer: (hand: Hand) => WinningHand | undefined) : this {
        const winningHand = analyzer(this);
        if (winningHand) {
            this._winningHands.push(winningHand);
        }
        return this;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
    
}