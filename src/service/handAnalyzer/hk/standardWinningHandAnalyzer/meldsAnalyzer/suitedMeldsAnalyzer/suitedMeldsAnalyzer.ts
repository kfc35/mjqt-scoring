import { MeldsAnalyzer } from "service/handAnalyzer/hk/standardWinningHandAnalyzer/meldsAnalyzer/meldsAnalyzer"
import { Hand } from "model/hand/hk/hand"
import { type SuitedTileGroup } from "model/tile/group/suitedTile";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import Meld from "model/meld/meld";
import Pair from "model/meld/pair";
import Chow from "model/meld/chow";
import Pong from "model/meld/pong";
import { meldPairLength, meldChowLength, meldPongLength } from "model/meld/meldConstants";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue, getNextSuitedTileValue } from "model/tile/tileValue";
import SuitedTileValueQuantityMemo from "service/handAnalyzer/hk/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/suitedTileValueQuantityMemo";

export const analyzeForSuitedMelds : MeldsAnalyzer = (hand: Hand) => {
    const bambooMelds = getSuitedMelds(hand, TileGroup.BAMBOO);
    //const characterMelds = getSuitedMelds(hand, TileGroup.CHARACTER);
    //const circleMelds = getSuitedMelds(hand, TileGroup.CIRCLE);

    const suitedMelds = [];
    // TODO cartesian product across all types of melds
    if (bambooMelds) {
        suitedMelds.push(...bambooMelds);
    }
    return suitedMelds;
}

function getSuitedMelds(hand: Hand, tileGroup: SuitedTileGroup) : Meld[][] | undefined {
    const memo = new SuitedTileValueQuantityMemo(hand, tileGroup); 
    return getSuitedMeldsSubFun(tileGroup, SuitedTileValue.ONE, memo);
}

function getSuitedMeldsSubFun(tileGroup: SuitedTileGroup, suitedTileValue: SuitedTileValue | undefined, quantityMemo: SuitedTileValueQuantityMemo) : Meld[][] {
    if (suitedTileValue === undefined) {
        return []; // finished processing for this tileGroup
    }
    const quantity = quantityMemo.getQuantity(suitedTileValue);
    if (quantity === 0) {
        return getSuitedMeldsSubFun(tileGroup, getNextSuitedTileValue(suitedTileValue), quantityMemo)
    }
    if (quantity === 1) {
        if (quantityMemo.hasEnoughQuantityForChows(suitedTileValue, 1)) {
            const chow = createChow(tileGroup, suitedTileValue, quantityMemo);
            const nextMelds = getSuitedMeldsSubFun(tileGroup, getNextSuitedTileValue(suitedTileValue), quantityMemo);
            if (nextMelds.length === 0) {
                return [[chow]];
            }
            return nextMelds.map(melds => [chow, ...melds]);
        }
        return []; // one lone tile that cannot be used in a meld, so short circuit out for filtering out.
    }
    if (quantity === 2) {
        // can be a pair
        const pairRemovedMemo = new SuitedTileValueQuantityMemo(quantityMemo);
        const pair = createPair(tileGroup, suitedTileValue, pairRemovedMemo);
        const nextMeldsWithoutPair = getSuitedMeldsSubFun(tileGroup, getNextSuitedTileValue(suitedTileValue), pairRemovedMemo);
        const nextMelds = (nextMeldsWithoutPair.length === 0 ? [[pair]] : nextMeldsWithoutPair.map(melds => [pair, ...melds]));

        // can also be two chows if there is sufficient quantity
        if (quantityMemo.hasEnoughQuantityForChows(suitedTileValue, 2)) {
            const chowsRemovedMemo = new SuitedTileValueQuantityMemo(quantityMemo);
            const chows = [createChow(tileGroup, suitedTileValue, chowsRemovedMemo),
                createChow(tileGroup, suitedTileValue, chowsRemovedMemo)];
            const nextMeldsWithoutChows = getSuitedMeldsSubFun(tileGroup, getNextSuitedTileValue(suitedTileValue), chowsRemovedMemo);
            const nextMeldsWithChows = (nextMeldsWithoutChows.length === 0 ? [chows]: nextMeldsWithoutChows.map(melds => [...chows, ...melds]));
            return [...nextMelds, ...nextMeldsWithChows];
        }
        return nextMelds;
    }
    if (quantity === 3) {
        // can be a pong.
        const pongRemovedMemo = new SuitedTileValueQuantityMemo(quantityMemo);
        const pong = new Pong(constructSuitedTile(tileGroup, suitedTileValue));
        pongRemovedMemo.decreaseQuantity(suitedTileValue, meldPongLength);
        const nextMeldsWithoutPong = getSuitedMeldsSubFun(tileGroup, getNextSuitedTileValue(suitedTileValue), pongRemovedMemo);
        const nextMelds = (nextMeldsWithoutPong.length === 0 ? [[pong]] : nextMeldsWithoutPong.map(melds => [pong, ...melds]));

        // can be one chow and a pair
        if (quantityMemo.hasEnoughQuantityForChows(suitedTileValue, 1)) {
            return [];
        }

        // can be three chows
        if (quantityMemo.hasEnoughQuantityForChows(suitedTileValue, 3)) {
            return [];
        }

        return nextMelds;
    }
    if (quantity === 4) {
        // can be a kong, one pong and one chow, four chows
        // cannot be two pairs.
    }
    return []; // invalid quantity, short circuit out.
}

function createPair(suitedTileGroup: SuitedTileGroup, suitedTileValue : SuitedTileValue, quantityMemo: SuitedTileValueQuantityMemo) : Pair {
    quantityMemo.decreaseQuantity(suitedTileValue, meldPairLength);
    return new Pair(constructSuitedTile(suitedTileGroup, suitedTileValue));
}

function createChow(suitedTileGroup: SuitedTileGroup, suitedTileValue : SuitedTileValue, quantityMemo: SuitedTileValueQuantityMemo) : Chow {
    const [[stv1, ],[stv2, ], [stv3, ]] = quantityMemo.decreaseQuantityForChow(suitedTileValue, meldChowLength);
    return new Chow([constructSuitedTile(suitedTileGroup, stv1),constructSuitedTile(suitedTileGroup, stv2), constructSuitedTile(suitedTileGroup, stv3)]);
}