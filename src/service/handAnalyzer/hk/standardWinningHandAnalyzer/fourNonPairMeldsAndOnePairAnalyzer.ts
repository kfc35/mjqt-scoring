import { HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { Hand } from "model/hand/hk/hand"
import { StandardWinningHand } from "model/hand/hk/standardWinningHand"
import Meld from "model/meld/meld";
import { analyzeForHonorMelds } from "service/handAnalyzer/hk/standardWinningHandAnalyzer/meldsAnalyzer/honorMeldsAnalyzer/honorMeldsAnalyzer";
import { analyzeForSuitedMelds } from "service/handAnalyzer/hk/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/suitedMeldsAnalyzer";}

export const analyzeForFourNonPairMeldsAndOnePair : HandAnalyzer<StandardWinningHand> = (hand: Hand) => {
    // all other standard winning hands (4 non-pair melds and 1 pair meld).
    // Overall, navigate greedily, filter bad combos at the end.
    const possibleMeldCombinations: Meld[][] = [];
    const honorMelds = analyzeForHonorMelds(hand);

    // for knitted straights, this algo will need to be changed
    // TODO suited tile melds
    const suitedMelds = analyzeForSuitedMelds(hand);

    if (suitedMelds.length > 0 && honorMelds.length > 0) {
        possibleMeldCombinations.push(...honorMelds);
        //TODO fix to cartesian product
        possibleMeldCombinations
            .forEach(possibleMeldCombo => possibleMeldCombo.push(...suitedMelds));
    } else if (honorMelds.length > 0) { // the honor melds themselves may be the only winning hand.
        possibleMeldCombinations.push(...honorMelds);
    } else {
        possibleMeldCombinations.push(...suitedMelds);
    }
    
    return possibleMeldCombinations
    //.filter(melds => ) melds must have 1 pair, must have numKongs, must be length 5, tile sum must equal hand length, must contain pre-specified melds
    .map(melds => new StandardWinningHand(melds,hand.flowerTiles))
}