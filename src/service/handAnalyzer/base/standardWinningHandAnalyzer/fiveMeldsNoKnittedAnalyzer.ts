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
    // if the hand has user specified melds, they must be present in all possible winning hands.
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

        // multiple winning hands could be possible depending on which meld we choose to have the most recent tile in.
        // TODO does it really matter to the user to distinguish this if the hands essentially have the same melds? 
        // the melds are essentially the same... it could matter in scoring for some of the special hands. have to look.
        return melds.map((meld, index) => {
            // if meld does not have the most recent tile, or the meld was previously exposed, this meld cannot accept the most recent tile.
            if (!meldHasTile(meld, hand.mostRecentTile()) || meld.exposed) {
                return undefined;
            }
            
            // this meld has the most recent tile and is currently marked as unexposed
            // mostRecentTileUserSpecifiedMeld is undefined, so hand.mostRecentTileIsSelfDrawn could have been set manually by the user.
            if (!hand.mostRecentTileIsSelfDrawn()) {
                // if mostRecentTileUserSpecifiedMeld was not specified, but the recent tile is eaten via discard, 
                // use it to complete this meld via discard (expose it)
                const updatedMelds = [...melds];
                const newlyExposedMeld = meld.clone(true);
                updatedMelds.splice(index, 1, newlyExposedMeld);
                return new StandardWinningHand(updatedMelds, index, hand.mostRecentTile(), hand.flowerTiles);
            } else { // the self drawn tile was used to complete this concealed meld, so mark it as such.
                return new StandardWinningHand(melds, index, hand.mostRecentTile(), hand.flowerTiles);
            }
        }).filter(winningHands => !!winningHands)
    })
    .reduce<StandardWinningHand[]>((accum, winningHands) => accum.concat(...winningHands), [])
}