import type { MeldsAnalyzer } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/meldsAnalyzer";
import { Hand } from "model/hand/hk/hand";
import { oneFourSeven, twoFiveEight, threeSixNine} from "model/tile/tileValue";
import { type SuitedTileGroup, suitedTileGroups } from "model/tile/group/suitedTile";
import Chow from "model/meld/chow";
import Meld from "model/meld/meld";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { getOnlyTruthyElement } from "common/generic/setUtils";
import { getIndexOfMeldIgnoreExposed } from "common/meldUtils";
import { meldExistsInMeldsIgnoreExposed } from "common/meldUtils";

export const analyzeForKnittedStraightMelds : MeldsAnalyzer = (hand: Hand) => {
    for (const firstSuitedTileGroup of suitedTileGroups) {
        if (tileQuantitiesGreaterThanZero(hand, firstSuitedTileGroup, oneFourSeven)) {

            const otherTwoTileGroups = getOtherTwoSuitedTileGroups(firstSuitedTileGroup);
            for (const secondSuitedTileGroup of otherTwoTileGroups) {
                if (tileQuantitiesGreaterThanZero(hand, secondSuitedTileGroup, twoFiveEight)) {

                    const thirdSuitedTileGroup = getLastSuitedTileGroup(firstSuitedTileGroup, secondSuitedTileGroup);
                    if (tileQuantitiesGreaterThanZero(hand, thirdSuitedTileGroup, threeSixNine)) {
                        const knittedStraight = getKnittedStraight(hand, firstSuitedTileGroup, secondSuitedTileGroup, thirdSuitedTileGroup);
                        return [knittedStraight, []]; // we can create a knitted straight, or we could choose not to (empty Meld[])
                    }   
                }
             }
        }
    }
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

function getKnittedStraight(hand: Hand, firstSuitedTileGroup: SuitedTileGroup, secondSuitedTileGroup: SuitedTileGroup, thirdSuitedTileGroup: SuitedTileGroup) : Meld[] {
    const potentialKnittedStraight = [new Chow([constructSuitedTile(firstSuitedTileGroup, oneFourSeven[0]),
        constructSuitedTile(secondSuitedTileGroup, twoFiveEight[0]), constructSuitedTile(thirdSuitedTileGroup, threeSixNine[0])]),
        new Chow([constructSuitedTile(firstSuitedTileGroup, oneFourSeven[1]),
        constructSuitedTile(secondSuitedTileGroup, twoFiveEight[1]), constructSuitedTile(thirdSuitedTileGroup, threeSixNine[1])]),
        new Chow([constructSuitedTile(firstSuitedTileGroup, oneFourSeven[2]),
        constructSuitedTile(secondSuitedTileGroup, twoFiveEight[2]), constructSuitedTile(thirdSuitedTileGroup, threeSixNine[2])])];

    const knittedStraight: Meld[] = [];
    for (const knittedChow of [...potentialKnittedStraight]) {
        // Ensure the chows have the correct exposed flag according to userSpecifiedMelds, if there are matches.
        if (meldExistsInMeldsIgnoreExposed(hand.userSpecifiedMelds, knittedChow)) {
            const indexOfMeld = getIndexOfMeldIgnoreExposed(hand.userSpecifiedMelds, knittedChow);
            const matchingMeld = hand.userSpecifiedMelds[indexOfMeld];
            if (matchingMeld) {
                knittedStraight.push(matchingMeld.clone());
            } else {
                throw new Error('Undefined matchingMeld, this should not happen.');
            }
        } else {
            knittedStraight.push(knittedChow);
        }
    }
    return knittedStraight;
}