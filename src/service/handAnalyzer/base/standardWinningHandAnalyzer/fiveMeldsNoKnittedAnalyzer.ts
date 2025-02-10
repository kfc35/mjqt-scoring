import { HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { Hand } from "model/hand/hk/hand"
import Meld from "model/meld/meld";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand"
import { analyzeForHonorMelds } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/honorMeldsAnalyzer/honorMeldsAnalyzer";
import { analyzeForNonKnittedSuitedMelds } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/nonKnittedSuitedMeldsAnalyzer";
import { cartesianProduct, meldsHasOnePair, meldsNumKongs, meldsNumTiles, meldsAreSubset, toFlatTiles, meldHasTile, getIndexOfMeld } from "common/meldUtils";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { handMinLengthWithoutFlowers } from "model/hand/hk/handConstants";

export const analyzeForFiveMeldsNoKnitted : HandAnalyzer<StandardWinningHand> = (hand: Hand) => {

    // all other standard winning hands (4 non-pair melds and 1 pair meld).
    // Overall, navigate greedily, filter bad combos at the end.
    const honorMelds = analyzeForHonorMelds(hand);
    const suitedMelds = analyzeForNonKnittedSuitedMelds(hand);
    const possibleMeldCombinations = cartesianProduct(honorMelds, suitedMelds);

    const numKongs = hand.getTotalQuantity() - handMinLengthWithoutFlowers;
    return possibleMeldCombinations
    // one pair and four non pairs, with the correct number of kongs.
    .filter(melds => meldsHasOnePair(melds))
    .filter(melds => melds.length === 5)
    .filter(melds => meldsNumKongs(melds) === numKongs)
    // all tiles in the hand should be represented within the melds
    .filter(melds => meldsNumTiles(melds) === hand.getTotalQuantity())
    .filter(melds => {
        const meldTiles = toFlatTiles(melds);
        const meldTileQuantityMap = new TileToQuantityMap(meldTiles);
        return meldTiles.every(tile => meldTileQuantityMap.getQuantity(tile) === hand.getQuantity(tile))
    })
    // if the hand has user specified melds, they must be present in the possible meld combo.
    .filter(melds => meldsAreSubset(melds, hand.userSpecifiedMelds, true))
    .map(melds => {
        const mostRecentTileUserSpecifiedMeld: Meld | undefined = hand.mostRecentTileUserSpecifiedMeld();
        if (mostRecentTileUserSpecifiedMeld) { // If this meld exists, the last tile should always be placed in this meld.
            const indexOfMeld = getIndexOfMeld(melds, mostRecentTileUserSpecifiedMeld);
            if (indexOfMeld === -1) {
                throw new Error('The mostRecentTileUserSpecifiedMeld is not in melds, which should not happen.');
            }
            return [new StandardWinningHand(melds, indexOfMeld, hand.mostRecentTile(), hand.flowerTiles)]
        }

        // multiple winning hands could be possible depending on which meld we choose to have the most recent tile.
        // TODO does it really matter to the user to distinguish this if the hands essentially have the same melds? 
        // the melds are essentially the same... it could for some of the special hands. have to look.
        return melds.map((meld, index) => {
            if (!meldHasTile(meld, hand.mostRecentTile()) || meld.exposed) {
                return undefined;
            }
            return new StandardWinningHand(melds, index, hand.mostRecentTile(), hand.flowerTiles);
        }).filter(winningHands => !!winningHands)
    })
    .reduce<StandardWinningHand[]>((accum, winningHands) => accum.concat(...winningHands), [])
}