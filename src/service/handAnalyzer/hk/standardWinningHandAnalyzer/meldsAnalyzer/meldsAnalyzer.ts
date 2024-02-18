import { Hand } from "model/hand/hk/hand"
import Meld from "model/meld/meld";

// It's a nested list because, in the case of suited melds, there can be more than one way to arrange them.
export type MeldsAnalyzer = (hand: Hand) => Meld[][];