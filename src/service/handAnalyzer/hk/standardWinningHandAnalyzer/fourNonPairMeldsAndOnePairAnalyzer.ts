import { HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { Hand } from "model/hand/hk/hand"
import { StandardWinningHand } from "model/hand/hk/standardWinningHand"
import Meld from "model/meld/meld";
import { TileGroup } from "model/tile/tileGroup";
import { dragonTileValues, windTileValues, suitedTileValues } from "model/tile/tileValue";
import { type HonorTileGroup, type HonorTileValue } from "model/tile/group/honorTile";

export const analyzeForFourNonPairMeldsAndOnePair : HandAnalyzer<StandardWinningHand> = (hand: Hand) => {
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
    //.filter(melds => ) melds must have 1 pair, must have numKongs, must be length 5, tile sum must equal hand length, must contain pre-specified melds
    .map(melds => new StandardWinningHand(melds,hand.flowerTiles))
}

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
        decreaseQuantityForSuitedTileValue(suitedTileValue, pairRemovedMemo, meldPairLength);
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
        // can be a pong.
        const pongRemovedMemo = [...qtyIndexedBySTVal];
        const pong = new Pong(constructSuitedTile(tileGroup, suitedTileValue));
        decreaseQuantityForSuitedTileValue(suitedTileValue, pongRemovedMemo, meldPongLength);
        const nextMeldsWithoutPong = getSuitedMeldsSubFun(hand, tileGroup, getNextTileValue(suitedTileValue), pongRemovedMemo);
        const nextMelds = (nextMeldsWithoutPong.length === 0 ? [[pong]] : nextMeldsWithoutPong.map(melds => [pong, ...melds]));

        // can be one chow and a pair
        if (canCreateChows(suitedTileValue, qtyIndexedBySTVal, 1)) {
            return [];
        }

        // can be three chows
        if (canCreateChows(suitedTileValue, qtyIndexedBySTVal, 3)) {
            return [];
        }

        return nextMelds;
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