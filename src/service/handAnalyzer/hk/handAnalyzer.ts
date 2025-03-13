import { Hand } from "model/hand/hk/hand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { analyzeForSpecialWinningHands } from "service/handAnalyzer/base/specialWinningHandAnalyzer/specialWinningHandAnalyzer";
import { analyzeForStandardWinningHands } from "service/handAnalyzer/hk/standardWinningHandAnalyzer/standardWinningHandAnalyzer";

export type HandAnalyzer<T extends WinningHand> = (hand: Hand) => T[]

export const analyzeHandForWinningHands : HandAnalyzer<WinningHand> = (hand: Hand) => {
    const specialWinningHands = analyzeForSpecialWinningHands(hand);
    if (specialWinningHands.length > 0) {
        return specialWinningHands;
    }

    const standardWinningHands = analyzeForStandardWinningHands(hand);
    if (standardWinningHands.length > 0) {
        return standardWinningHands;
    }

    return [];
}