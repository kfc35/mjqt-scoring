import { Meld } from "model/meld/meld.js";
import { Tile, FlowerTile } from "model/tile/tile.js";

/** A WinningHand is a Hand that has been analyzed for a win condition i.e. processed into melds. */
export class StandardWinningHand {
    melds: Meld[];
    bonusTiles: FlowerTile[];
    // map from faan to "explanation", could be a single meld, multiple melds, individual tiles, whole hand, actions unrelated to your hand

    constructor(melds: Meld[], bonusTiles: FlowerTile[]) {
        // assert each tile is not null
        // must have at least 14 non bonus tiles.
        // each individual mahjong tile can only appear max 4 times.
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands.
        this.melds = melds!;
        this.bonusTiles = bonusTiles!;
    }

    analyzeWinningHandForFaan(analyzer: (winningHand: WinningHand) => void) : this {
        analyzer(this);
        return this;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
}

// algorithm for processing a hand into melds:
// check for all pairs - seven tiles with quantity 2 if not, you can assume there is only one pair in the hand.
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
