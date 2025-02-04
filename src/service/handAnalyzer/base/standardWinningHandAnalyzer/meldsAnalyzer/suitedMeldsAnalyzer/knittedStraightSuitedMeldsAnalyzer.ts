import type { MeldsAnalyzer } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/meldsAnalyzer";
import { Hand } from "model/hand/hk/hand";
import { oneFourSeven, twoFiveEight, threeSixNine} from "model/tile/tileValue";
import { type SuitedTileGroup, suitedTileGroups } from "model/tile/group/suitedTile";
import Chow from "model/meld/chow";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { getOnlyTruthyElement } from "common/generic/setUtils";

export const analyzeForKnittedStraightMelds : MeldsAnalyzer = (hand: Hand) => {
    for (const firstSuitedTileGroup of suitedTileGroups) {
        if (tileQuantitiesGreaterThanZero(hand, firstSuitedTileGroup, oneFourSeven)) {
            const otherTwoTileGroups = getOtherTwoSuitedTileGroups(firstSuitedTileGroup);
            for (const secondSuitedTileGroup of otherTwoTileGroups) {
                if (tileQuantitiesGreaterThanZero(hand, secondSuitedTileGroup, twoFiveEight)) {
                    const thirdSuitedTileGroup = getLastSuitedTileGroup(firstSuitedTileGroup, secondSuitedTileGroup);
                    if (tileQuantitiesGreaterThanZero(hand, thirdSuitedTileGroup, threeSixNine)) {
                        return [[new Chow([constructSuitedTile(firstSuitedTileGroup, oneFourSeven[0]),
                            constructSuitedTile(secondSuitedTileGroup, twoFiveEight[0]),
                            constructSuitedTile(thirdSuitedTileGroup, threeSixNine[0])],
                            false),
                            new Chow([constructSuitedTile(firstSuitedTileGroup, oneFourSeven[1]),
                            constructSuitedTile(secondSuitedTileGroup, twoFiveEight[1]),
                            constructSuitedTile(thirdSuitedTileGroup, threeSixNine[1])],
                            false),
                            new Chow([constructSuitedTile(firstSuitedTileGroup, oneFourSeven[2]),
                            constructSuitedTile(secondSuitedTileGroup, twoFiveEight[2]),
                            constructSuitedTile(thirdSuitedTileGroup, threeSixNine[2])],
                            false)], []]; // we can create a knitted straight, or we could choose not to (empty Meld[])
                    }   
                }
             }
        }
    }
    // cannot create a knitted straight
    return [];
}

function getOtherTwoSuitedTileGroups(oneSuitedTileGroup: SuitedTileGroup) {
    const otherTwoTileGroups = new Set(suitedTileGroups);
    otherTwoTileGroups.delete(oneSuitedTileGroup);
    return otherTwoTileGroups;
}

function getLastSuitedTileGroup(firstSuitedTileGroup: SuitedTileGroup, secondSuitedTileGroup: SuitedTileGroup) {
    if (firstSuitedTileGroup === secondSuitedTileGroup) {
        throw new Error('Suited tile groups must be different from each other.');
    }
    const suitedTileGroupsCopy = new Set(suitedTileGroups);
    suitedTileGroupsCopy.delete(firstSuitedTileGroup);
    suitedTileGroupsCopy.delete(secondSuitedTileGroup);
    // there should only be one element left.
    return getOnlyTruthyElement(suitedTileGroupsCopy);
}

function tileQuantitiesGreaterThanZero(hand: Hand, tileGroup: SuitedTileGroup, suitedTileValues: typeof oneFourSeven | typeof twoFiveEight | typeof threeSixNine): boolean {
    return hand.getQuantity(tileGroup, suitedTileValues[0]) > 0 && 
    hand.getQuantity(tileGroup, suitedTileValues[1]) > 0 && 
    hand.getQuantity(tileGroup, suitedTileValues[2]) > 0
}