import { Hand } from "model/hand/hk/hand";
import { WinningHand } from "model/hand/hk/WinningHand";
import { dragonTileValues, windTileValues } from "model/tile/tileValue";
import Meld from "model/meld/meld";
import Pair from "model/meld/pair";
import Pong from "model/meld/pong";
import Kong from "model/meld/kong";
import { HonorTileGroup, HonorTileValue, constructHonorTile, isHonorTile } from "model/tile/group/honorTile";
import { TileGroup } from "model/tile/tileGroup";
import { handMinLength } from "model/hand/hk/handUtils";
import { thirteenOrphansAnalyzer } from "service/handAnalyzer/hk/thirteenOrphansAnalyzer";
import { sevenPairsAnalyzer } from "service/handAnalyzer/hk/sevenPairsAnalyzer";
import { StandardWinningHand } from "model/hand/hk/standardWinningHand";

export function analyzeHandForWinningHands(hand : Hand): WinningHand[] {
    const thirteenOrphansHand = thirteenOrphansAnalyzer(hand);
    if (thirteenOrphansHand) {
        return [thirteenOrphansHand];
    }
    const sevenPairsHand = sevenPairsAnalyzer(hand);
    if (sevenPairsHand) {
        return [sevenPairsHand];
    }
    // TODO smelly?
    // if there are any honor tiles that have quantity 1, it is not a winning hand.
    if (hand.getQuantityToTileMap().get(1)?.every(tile => !isHonorTile(tile))) {
        return [];
     }
    
    const possibleMeldCombinations: Meld[][] = [];
    let numKongs = hand.getTotalQuantity() - handMinLength;
    getHonorMelds(hand, TileGroup.DRAGON, dragonTileValues);
    getHonorMelds(hand, TileGroup.WIND, windTileValues);
    // for knitted straights, this algo will need to be changed

    return possibleMeldCombinations.map(melds => new StandardWinningHand(melds,hand.flowerTiles))
}

export type HandAnalyzer = (hand: Hand) => WinningHand | undefined

function getHonorMelds(hand: Hand, tileGroup: HonorTileGroup, tileValues: HonorTileValue[]) : Meld[] | undefined {
    const melds : Meld[] = [];
    for (const tileValue of tileValues) {
        const meld: Meld | undefined = getHonorMeld(hand, tileGroup, tileValue);
        if (meld) {
            melds.push(meld);
        }
    }
    return melds;
}

function getHonorMeld(hand: Hand, tileGroup: HonorTileGroup, tileValue: HonorTileValue) : Meld | undefined {
    const quantity = hand.getQuantity(tileGroup, tileValue);
    if (!quantity) {
        // no-op
        return undefined;
    } else if (quantity === 1) {
        // not possible in a winning hand.
        // return undefined;?
        throw new Error(`Hand has no winning hand. Found only one honor tile for ${tileGroup} ${tileValue}`);
    } else if (quantity === 2) {
        return new Pair(constructHonorTile(tileGroup, tileValue));
    } else if (quantity === 3) {
        return new Pong(constructHonorTile(tileGroup, tileValue));
    } else if (quantity === 4) {
        return new Kong(constructHonorTile(tileGroup, tileValue));
    } else {
        throw new Error("Hand is malformed. Found quantity greater than 4: " + quantity);
    }
}

// algorithm for processing a hand into melds:
// honors - easily check for pairs, pongs, and kongs. these will always be valid.
// suited - for 1-7, check quantity. 
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
