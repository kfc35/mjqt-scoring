import { HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { Hand } from "model/hand/hk/hand";
import { analyzeForSevenPairs } from "service/handAnalyzer/base/standardWinningHandAnalyzer/sevenPairsAnalyzer";
import { analyzeForFiveMeldsNoKnitted } from "service/handAnalyzer/base/standardWinningHandAnalyzer/fiveMeldsNoKnittedAnalyzer";

export const analyzeForStandardWinningHands : HandAnalyzer<StandardWinningHand> = (hand: Hand) => {
    // check for 7 pairs separately to simplify logic.
    const sevenPairsHand = analyzeForSevenPairs(hand);
    if (sevenPairsHand) {
        return sevenPairsHand;
    }

    const regularWinningHands = analyzeForFiveMeldsNoKnitted(hand);
    if (regularWinningHands) {
        return regularWinningHands;
    }

    return [];
}