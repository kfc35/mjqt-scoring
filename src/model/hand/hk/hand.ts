"use strict";

import { assertTilesNotNullAndCorrectLength } from "common/tileUtils";
import { TileGroup } from "model/tile/tileGroup";
import { type TileValue } from "model/tile/tileValue";
import { FlowerTile, flowerTileGroups, HongKongTile } from "model/tile/hk/hongKongTile";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { WinningHand } from "model/hand/hk/winningHand";

export const handMinLength = 14;
export const handMaxNumFlowers = 8;
// max length =  min length + 8 flower tiles + 4 bonus kong tiles.
export const handMaxLength = 26;

// each individual non flower mahjong tile can only appear max 4 times.
export const maxUniqueTilePerHand = 4;

/** A Hand is an unsorted collection of Mahjong Tiles during play.
 * It represents an instance when it is the player's turn (i.e. there are a minimum of 14 tiles instead of 13.)
 * It may or may not represent a winning hand. */
export class Hand {
    private _tileToQuantity: ReadonlyMap<TileGroup, Map<TileValue, number>>;
    private _winningHands: WinningHand[];

    constructor(unsortedTiles: HongKongTile[]) {
        assertTilesNotNullAndCorrectLength(unsortedTiles, handMinLength, handMaxLength);
        const sortedCopy = [...unsortedTiles].sort((tile1, tile2) => tile1.compareTo(tile2));

        const flowerTiles : FlowerTile[] = sortedCopy.filter(tile => flowerTileGroups.has(tile.getGroup())) as FlowerTile[];
        if (flowerTiles.length > handMaxNumFlowers) {
            throw new TypeError("A Hand can only have max " + handMaxNumFlowers + " number of flower tiles.");
        }
        if (flowerTiles.reduce((hasDup, tile, index) => 
            index + 1 > flowerTiles.length ? hasDup : hasDup || tile.equals(flowerTiles[index+1]!), false)) {
            throw new TypeError("A Hand cannot have duplicate flower tiles.");
        }
        const nonFlowerTiles : SuitedOrHonorTile[] = sortedCopy.filter(tile => !flowerTileTypes.has(tile.getGroup())) as SuitedOrHonorTile[];
        if (nonFlowerTiles.length < handMinLength) {
            throw new TypeError("A Hand must have at least " + handMinLength + " non flower tiles.");
        }

        // TODO this should be a util and connected with what types are possible for hk hands.
        const tileToQuantity : Map<TileType, Map<TileValue, number>>= new Map([
            [TileType.BAMBOO, new Map<SuitedTileValue, number>()],
            [TileType.CIRCLE, new Map<SuitedTileValue, number>()],
            [TileType.CHARACTER, new Map<SuitedTileValue, number>()]
        ]);
        tileToQuantity.set(TileType.DRAGON, new Map<DragonTileValue, number>());
        tileToQuantity.set(TileType.WIND, new Map<WindTileValue, number>());
        tileToQuantity.set(TileType.GENTLEMAN, new Map<GentlemanTileValue, number>());
        tileToQuantity.set(TileType.SEASON, new Map<SeasonTileValue, number>());
        sortedCopy.forEach(tile => {
            const quantityMap: Map<TileValue, number> = tileToQuantity.get(tile.getGroup())!;
            quantityMap.set(tile.value as TileValue, 
                !quantityMap.get(tile.value as TileValue) ? 1 : quantityMap.get(tile.value as SuitedOrHonorTileValue)! + 1);
        });
        // TODO write this more clearly. Basically unwrapping values and trying to find quantities greather than 4.
        const quantityMaps = [...tileToQuantity.values()];
        const existsQuantityGreaterThanMaxUniqueTilePerHand = [...quantityMaps.values()].reduce((hasQuantityGreaterThanMaxUniqueTilePerHand, quantityMap) => {
            return hasQuantityGreaterThanMaxUniqueTilePerHand || 
                [...quantityMap.values()].reduce((hasQuantityGreaterThanMaxUniqueTilePerHand, quantity) => {
                    return hasQuantityGreaterThanMaxUniqueTilePerHand || quantity > maxUniqueTilePerHand;
                }, false);
        }, false);
        if (existsQuantityGreaterThanMaxUniqueTilePerHand) {
            throw new TypeError("A Hand can only have max " + maxUniqueTilePerHand + " of each unique suited or honor tile.");
        }
        
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands.
        this._tileToQuantity = tileToQuantity;
        this._winningHands = [];
    }

    get tileToQuantity() {
        return this._tileToQuantity;
    }

    get winningHands() {
        return this._winningHands;
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