import { Hand } from "model/hand/hk/hand"
import { Meld } from "model/meld/meld";

// It's a nested list because, in the case of suited melds, there can be more than one way to arrange them.
// i.e. 3 consecutive pongs OR 3 identical chows
// The resulting melds must be further analyzed for win condition.
export type MeldsAnalyzer = (hand: Hand) => Meld[][];