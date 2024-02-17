import { HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { StandardWinningHand } from "model/hand/hk/standardWinningHand";
import { Hand } from "model/hand/hk/hand";
import { analyzeForSevenPairs } from "service/handAnalyzer/hk/standardWinningHandAnalyzer/sevenPairsAnalyzer";

export const analyzeForStandardWinningHands : HandAnalyzer<StandardWinningHand> = (hand: Hand) => {
    // a standard winning hand, but pre-checked for simplicity of logic.
    const sevenPairsHand = analyzeForSevenPairs(hand);
    if (sevenPairsHand) {
        return sevenPairsHand;
    }

    return [];
}