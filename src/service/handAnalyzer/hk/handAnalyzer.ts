import { Hand } from "model/hand/hk/hand";
import { WinningHand } from "model/hand/hk/WinningHand";
import { FlowerTile, flowerTileGroups } from "model/tile/hk/hongKongTile";
import { Tile } from "model/tile/tile";
import { dragonTileValues, windTileValues, TileValue } from "model/tile/tileValue";
import Meld from "model/meld/meld";
import Pair from "model/meld/pair";
import Pong from "model/meld/pong";
import Kong from "model/meld/kong";
import { HonorTile } from "model/tile/group/honorTile";
import { TileGroup } from "model/tile/tileGroup";
import { handMinLength } from "model/hand/hk/handUtils";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";

export function analyzeHandForWinningHands(hand : Hand): WinningHand[] {

    // TODO: First check for bespoke hands.

    const flowerTiles: FlowerTile[] = hand.flowerTiles;
    const melds: Meld[] = [];

    const quantityOfTiles : number[] = hand.getQuantityPerUniqueTile();
    if (quantityOfTiles.every(quantity => quantity % 2 === 0)) {
        // all pairs hand.
        for (const [quantity, tileArray] of hand.getQuantityToTileMap()) {
            if (quantity === 2) {
                for (const tile of tileArray) {
                    if (!flowerTileGroups.has(tile.group)) {
                        melds.push(new Pair(tile as SuitedOrHonorTile));
                    }
                }
            }
            if (quantity === 4) {
                for (const tile of tileArray) {
                    if (!flowerTileGroups.has(tile.group)) {
                        melds.push(new Pair(tile as SuitedOrHonorTile));
                        melds.push(new Pair(tile as SuitedOrHonorTile));
                    }
                }
            }
        }
    }
    // short circuit out
    
    const numKongs = hand.getQuantityNonFlowerTiles() - handMinLength;
    getHonorMelds(hand, TileGroup.DRAGON, dragonTileValues);
    getHonorMelds(hand, TileGroup.WIND, windTileValues);
    /*if (dragonTileQuantities) {
        for (const tileValue of getEnumKeys(DragonTileValue).map(key => DragonTileValue[key].valueOf())) {
            const meld: Meld | undefined = getHonorMeld(dragonTileQuantities, TileGroup.DRAGON, tileValue);
            if (meld) {
                melds.push(meld);
            } 
        }
    }*/
}

export type HandAnalyzer = (hand: Hand) => WinningHand | undefined

function getSevenPairsStandardWinningHand(hand: Hand) : Meld[] {
    hand.
}

function getHonorMelds(hand: Hand, tileGroup: TileGroup, tileValues: TileValue[]) : Meld[] | undefined {
    const melds : Meld[] = [];
    for (const tileValue of tileValues) {
        const meld: Meld | undefined = getHonorMeld(hand.tileToQuantity.get(tileGroup), tileGroup, tileValue);
        if (meld) {
            melds.push(meld);
        }
    }
    return melds;
}

function getHonorMeld(tileGroupQuantities: Map<TileValue, number> | undefined, tileGroup: TileGroup, tileValue: TileValue) : Meld | undefined {
    if (!tileGroupQuantities) {
        return undefined;
    }
    const quantity = tileGroupQuantities.get(tileValue);
    if (!quantity) {
        // no-op
        return undefined;
    } else if (quantity === 1) {
        // not possible in a winning hand.
        // return undefined;?
        throw new Error(`Hand has no winning hand. Found only one honor tile for ${tileGroup} ${tileValue}`);
    } else if (quantity === 2) {
        return new Pair(new Tile(tileGroup, tileValue) as HonorTile);
    } else if (quantity === 3) {
        return new Pong(new Tile(tileGroup, tileValue) as HonorTile);
    } else if (quantity === 4) {
        return new Kong(new Tile(tileGroup, tileValue) as HonorTile);
    } else {
        throw new Error("Hand is malformed. Found quantity greater than 4: " + quantity);
    }
}

// algorithm for processing a hand into melds:
// check for all pairs - seven tiles with quantity 2 if not, you can assume there is only one pair in the hand.
        // TODO however there can be quantity 4. 3 quantity 4's and a 2 would also count as seven pairs...
// honors - easily check for pairs, pongs, and kongs. these will always be valid.
// suited - for 1-7, check quantity. 
// TODO - this doesn't work for knitted, but knitted isnt a thing in HK.
// MAYBE PROCESS KONGS FIRST GIVEN HOW MANY KONGS WE SHOULD EXPECT?
  // if quantity is 1:
    // can only be a chow for certain. if it cannot be made, invalid hand.
  // if quantity is 2:
    // could be a pair
    // cannot be one chow, cause you're left with a single
    // could be two chows
    // two chows can overlap with three pairs
  // if quantity is 3:
    // could be a pong
    // could be one chow and a pair (reqs quantity at least 1 for next two tiles)
    // cannot be two chows, cause youre left with a single
    // could be three chows (reqs quantity at least 3 for next two tiles), but what if chow is not able to be made?
      // three chows and three pongs overlap
    // must branch out the algorithm for each scenario
  // if quantity is 4:
      // could be a kong
      // could be one chow and a pong.
      // could be two chows and a pair
      // cannot be three chows, cause you're left with a single
      // could be four chows.
        // four chows, three kongs, and one chow and three pongs overlap.
      // must branch out the algorithm for each scenario
// for 8 and 9, cannot check for chows. must either be pairs, pongs, and kongs cause chow checking happened for 1-7.
  // decrease quantities as you go. make a copy of the map so as to not affect the map outside of the func.

/** create a bigger function called createMelds that returns a Meld[][] and works on a hand.
 * each entry in Meld[][] must be a Meld[] of length 5 (or 7 for 7 pairs).
 *   For length 5, must have one pair, and four non pair melds.
 *   For length 7, must be seven pairs
 * It initially gets the honors melds (and also checks for all pairs?)
 * Then, for suited melds, it defers to a subfunction. It keeps progress of how far it is in a given suit from 1-9.
 * the sub one createMelds returns Meld[][] and takes in Meld[] for previous melds and a copy of the rest of the quantity map to make melds on.
 * We can assert how many kongs should be in the final hand by how many extra non flower tiles there are.
 */
