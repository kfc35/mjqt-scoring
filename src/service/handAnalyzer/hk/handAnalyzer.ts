import { Hand } from "model/hand/hk/hand";
import { WinningHand } from "model/hand/hk/WinningHand";
import { dragonTileValues, getNextTileValue, suitedTileValues, windTileValues, SuitedTileValue } from "model/tile/tileValue";
import Meld from "model/meld/meld";
import Pair from "model/meld/pair";
import Chow from "model/meld/chow";
import Pong from "model/meld/pong";
import Kong from "model/meld/kong";
import { type HonorTileGroup, HonorTileValue } from "model/tile/group/honorTile";
import { constructHonorTile } from "model/tile/group/honorTileConstructor";
import { TileGroup } from "model/tile/tileGroup";
import { handMinLength } from "model/hand/hk/handConstants";
import { thirteenOrphansAnalyzer } from "service/handAnalyzer/hk/thirteenOrphansAnalyzer";
import { sevenPairsAnalyzer } from "service/handAnalyzer/hk/sevenPairsAnalyzer";
import { StandardWinningHand } from "model/hand/hk/standardWinningHand";
import SuitedTile, { SuitedTileGroup } from "model/tile/group/suitedTile";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";

export function analyzeHandForWinningHands(hand : Hand): WinningHand[] {
    // special winning hand
    const thirteenOrphansHand = thirteenOrphansAnalyzer(hand);
    if (thirteenOrphansHand) {
        return [thirteenOrphansHand];
    }

    // a standard winning hand, but pre-checked for simplicity of logic.
    const sevenPairsHand = sevenPairsAnalyzer(hand);
    if (sevenPairsHand) {
        return [sevenPairsHand];
    }
    
    // all other standard winning hands (4 non-pair melds and 1 pair meld).
    // Overall, navigate greedily, filter bad combos at the end.
    const possibleMeldCombinations: Meld[][] = [];
    const dragonMelds = getHonorMelds(hand, TileGroup.DRAGON, dragonTileValues);
    if (dragonMelds === undefined) {
        return [];
    }
    const windMelds = getHonorMelds(hand, TileGroup.WIND, windTileValues);
    if (windMelds === undefined) {
        return [];
    }
    const honorMelds: Meld[] = [];
    honorMelds.push(...dragonMelds);
    honorMelds.push(...windMelds);

    // for knitted straights, this algo will need to be changed
    // TODO suited tile melds
    const bambooMelds = getSuitedMelds(hand, TileGroup.BAMBOO);

    if (possibleMeldCombinations.length > 0) {
        possibleMeldCombinations
            .forEach(possibleMeldCombo => possibleMeldCombo.push(...honorMelds));
    } else { // the honor melds themselves may be the only winning hand.
        possibleMeldCombinations.push(honorMelds);
    }
    return possibleMeldCombinations
    //.filter(melds => ) melds must have 1 pair, must have numKongs, must be length 5, tile sum must equal hand length
    .map(melds => new StandardWinningHand(melds,hand.flowerTiles))
}

export type HandAnalyzer = (hand: Hand) => WinningHand | undefined

function getHonorMelds(hand: Hand, tileGroup: HonorTileGroup, tileValues: HonorTileValue[]) : Meld[] {
    const melds : Meld[] = [];
    for (const tileValue of tileValues) {
        const quantity = hand.getQuantity(tileGroup, tileValue);
        if (quantity === 1) { // hand cannot be a winning hand, so stop emitting melds prematurely.
            return [];
        }
        const meld: Meld | undefined = getHonorMeldIfPossible(quantity, tileGroup, tileValue);
        if (meld) {
            melds.push(meld);
        }
    }
    return melds;
}

function getHonorMeldIfPossible(quantity: number, tileGroup: HonorTileGroup, tileValue: HonorTileValue) : Meld | undefined {
    if (quantity < 2) {
        // quantity === 0 is a no-op. 
        // quantity === 1 means an invalid winning hand. Not an error.
        return undefined; 
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

function getSuitedMelds(hand: Hand, tileGroup: SuitedTileGroup) : Meld[][] | undefined {
    const qtyIndexedBySTVal: number[] = [];
    const tileValueQuantityMap = hand.getQuantitiesForTileGroup(tileGroup);
    for (const suitedTileValue of suitedTileValues) {
        // SuitedTileValue.ONE is at index 0, TWO is at index 1, etc.
        qtyIndexedBySTVal.push(tileValueQuantityMap.get(suitedTileValue) ?? 0);
    }
    
    return getSuitedMeldsSubFun(hand, tileGroup, SuitedTileValue.ONE, qtyIndexedBySTVal);
}

function getQuantityForSuitedTileValue(suitedTileValue: SuitedTileValue, qtyIndexedBySTVal: number[]): number {
    return qtyIndexedBySTVal[suitedTileValue.valueOf() - 1]!;
}

function decreaseQuantityForSuitedTileValue(suitedTileValue: SuitedTileValue, qtyIndexedBySTVal: number[], amtToDecrease?: number) {
    if (qtyIndexedBySTVal[suitedTileValue.valueOf() - 1]! - (amtToDecrease ?? 1) < 0) {
        throw new Error("Cannot decrement quantity less than 0.");
    }
    qtyIndexedBySTVal[suitedTileValue.valueOf() - 1] = qtyIndexedBySTVal[suitedTileValue.valueOf() - 1]! - (amtToDecrease ?? 1);
}

function getSuitedMeldsSubFun(hand: Hand, tileGroup: SuitedTileGroup, suitedTileValue: SuitedTileValue | undefined, qtyIndexedBySTVal: number[]) : Meld[][] {
    if (suitedTileValue === undefined) {
        return []; // finished processing for this tileGroup
    }
    const quantity = getQuantityForSuitedTileValue(suitedTileValue, qtyIndexedBySTVal);
    if (quantity === 0) {
        return getSuitedMeldsSubFun(hand, tileGroup, getNextTileValue(suitedTileValue), qtyIndexedBySTVal)
    }
    if (quantity === 1) {
        if (canCreateChows(suitedTileValue, qtyIndexedBySTVal, 1)) {
            const chow = createChow(tileGroup, suitedTileValue, qtyIndexedBySTVal);
            const nextMelds = getSuitedMeldsSubFun(hand, tileGroup, getNextTileValue(suitedTileValue), qtyIndexedBySTVal);
            if (nextMelds.length === 0) {
                return [[chow]];
            }
            return nextMelds.map(melds => [chow, ...melds]);
        }
        return []; // one lone tile that cannot be used in a meld, so short circuit out.
    }
    if (quantity === 2) {
        // can be a pair
        const pairRemovedMemo = [...qtyIndexedBySTVal];
        const pair = new Pair(constructSuitedTile(tileGroup, suitedTileValue));
        decreaseQuantityForSuitedTileValue(suitedTileValue, pairRemovedMemo, 2);
        const nextMeldsWithoutPair = getSuitedMeldsSubFun(hand, tileGroup, getNextTileValue(suitedTileValue), pairRemovedMemo);
        const nextMelds = (nextMeldsWithoutPair.length === 0 ? [[pair]] : nextMeldsWithoutPair.map(melds => [pair, ...melds]));

        // can also be two chows if there is sufficient quantity
        if (canCreateChows(suitedTileValue, qtyIndexedBySTVal, 2)) {
            const chowsRemovedMemo = [...qtyIndexedBySTVal];
            const chows = [createChow(tileGroup, suitedTileValue, chowsRemovedMemo),
                createChow(tileGroup, suitedTileValue, chowsRemovedMemo)];
            const nextMeldsWithoutChows = getSuitedMeldsSubFun(hand, tileGroup, getNextTileValue(suitedTileValue), chowsRemovedMemo);
            const nextMeldsWithChows = (nextMeldsWithoutChows.length === 0 ? [chows]: nextMeldsWithoutChows.map(melds => [...chows, ...melds]));
            return [...nextMelds, ...nextMeldsWithChows];
        }
        return nextMelds;
    }
    if (quantity === 3) {
        // can be a pong, one chow and a pair, or three chows.
    }
    if (quantity === 4) {
        // can be a kong, one pong and one chow, four chows
        // cannot be two pairs.
    }
}

function canCreateChows(suitedTileValue : SuitedTileValue, qtyIndexedBySTVal: number[], numChows: number) : boolean {
    const nextSuitedTileValue = getNextTileValue(suitedTileValue);
    if (nextSuitedTileValue === undefined) {
        return false;
    }
    const twoAfterSuitedTileValue = getNextTileValue(nextSuitedTileValue);
    if (twoAfterSuitedTileValue === undefined) {
        return false;
    }
    return (getQuantityForSuitedTileValue(suitedTileValue, qtyIndexedBySTVal) >= numChows && 
        getQuantityForSuitedTileValue(nextSuitedTileValue, qtyIndexedBySTVal) >= numChows &&
        getQuantityForSuitedTileValue(twoAfterSuitedTileValue, qtyIndexedBySTVal) >= numChows);
}

function createChow(suitedTileGroup: SuitedTileGroup, suitedTileValue : SuitedTileValue, qtyIndexedBySTVal: number[]) : Chow {
    const nextSuitedTileValue = getNextTileValue(suitedTileValue);
    if (nextSuitedTileValue === undefined) {
        throw new Error("Cannot create chow");
    }
    const twoAfterSuitedTileValue = getNextTileValue(nextSuitedTileValue);
    if (twoAfterSuitedTileValue === undefined) {
        throw new Error("Cannot create chow");
    }
    if (getQuantityForSuitedTileValue(suitedTileValue, qtyIndexedBySTVal) >= 1 && 
    getQuantityForSuitedTileValue(nextSuitedTileValue, qtyIndexedBySTVal) >= 1 &&
    getQuantityForSuitedTileValue(twoAfterSuitedTileValue, qtyIndexedBySTVal) >= 1) {
        decreaseQuantityForSuitedTileValue(suitedTileValue, qtyIndexedBySTVal);
        decreaseQuantityForSuitedTileValue(nextSuitedTileValue, qtyIndexedBySTVal);
        decreaseQuantityForSuitedTileValue(twoAfterSuitedTileValue, qtyIndexedBySTVal);
        return new Chow([constructSuitedTile(suitedTileGroup, suitedTileValue),
            constructSuitedTile(suitedTileGroup, nextSuitedTileValue),
            constructSuitedTile(suitedTileGroup, twoAfterSuitedTileValue)]);
    }
    throw new Error("Cannot create chow");
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
    // could be two chows (reqs quantity at least 2 for next two tiles)
    // two chows can overlap with three pairs. if we already check for 7 pairs, we do not need to check for this
    // if it could be both a pair OR two chows, separate out recursively.
  // if quantity is 3:
    // could be a pong
    // could be one chow and a pair (reqs quantity at least 1 for next two tiles)
    // cannot be two chows, cause youre left with a single
    // could be three chows (reqs quantity at least 3 for next two tiles), but what if chow is not able to be made?
      // three chows and three pongs overlap
    // must branch out the algorithm for each scenario
  // if quantity is 4:
      // could be a kong if you can spare one.
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
