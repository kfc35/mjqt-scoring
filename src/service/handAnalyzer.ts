// Given a hand, parse a winning hand out of it.
// Then each winning hand is processed for sub-hand faan's.

import { Hand } from "model/hand/hk/hand";
import { WinningHand } from "model/hand/hk/winningHand";

export type HandAnalyzer = {
    (hand: Hand) : WinningHand | undefined;
}

function analyzeHandForAllInTriples(hand: Hand): WinningHand {
    const tileToQuantity = hand.tileToQuantity;
}

// Create a bunch of function analyzers 
// Create a class that composes all the function analyzers and maps them to winning hands.
// 