import { HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { Hand } from "model/hand/hk/hand";
import { Meld } from "model/meld/meld";
import { Pair, meldIsPair } from "model/meld/pair";
import { isSuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { meldsNotNullAndCorrectLength, meldsAreSubset } from "common/meldUtils";

export const analyzeForSevenPairs = constructSevenPairsAnalyzer();

function constructSevenPairsAnalyzer() : HandAnalyzer<MeldBasedWinningHand> {
    return (hand: Hand) => {
        if (!hand.userSpecifiedMelds.every(meld => meldIsPair(meld))) {
            return [];
        }
        const pairs: Pair[] = hand.userSpecifiedMelds;
        if (hand.getQuantityPerUniqueTile().every(quantity => quantity % 2 === 0)) {
            const melds : Meld[] = [];
            let winningMeldIndex : number = -1;
            for (const [quantity, tileArray] of hand.getQuantityToTileMap().entries()) {
                if (quantity === 2) {
                    for (const tile of tileArray) {
                        if (isSuitedOrHonorTile(tile)) {
                            const userSpecifiedPairs: Pair[] = pairs.filter(meld => tile.equals(meld.getFirstTile()));
                            if (userSpecifiedPairs.length > 1) {
                                return [];
                            } else if (userSpecifiedPairs.length === 1) {
                                if (userSpecifiedPairs[0] === undefined) {
                                    throw new Error('undefined userSpecifiedPair, this should not happen.');
                                }
                                melds.push(userSpecifiedPairs[0].clone());
                                if (hand.mostRecentTile().equals(tile)) {
                                    winningMeldIndex = melds.length - 1;
                                }
                            } else if (hand.mostRecentTile().equals(tile)) {
                                melds.push(new Pair(tile, !hand.mostRecentTileIsSelfDrawn()));
                                winningMeldIndex = melds.length - 1;
                            } else {
                                melds.push(new Pair(tile));
                            }
                            
                        }
                    }
                }
                if (quantity === 4) {
                    for (const tile of tileArray) {
                        if (isSuitedOrHonorTile(tile)) {
                            const userSpecifiedPairs: Pair[] = hand.userSpecifiedMelds.filter(meld => meldIsPair(meld) && tile.equals(meld.getFirstTile()));
                            if (userSpecifiedPairs.length === 1) {
                                if (!userSpecifiedPairs[0]) {
                                    throw new Error('undefined userSpecifiedPair, this should not happen.');
                                }
                                melds.push(userSpecifiedPairs[0].clone());
                                if (hand.mostRecentTile().equals(tile)) {
                                    winningMeldIndex = melds.length - 1;
                                }
                                melds.push(new Pair(tile));
                            } else if (userSpecifiedPairs.length === 2) {
                                if (!userSpecifiedPairs[0] || !userSpecifiedPairs[1]) {
                                    throw new Error('undefined userSpecifiedPairs, this should not happen.');
                                }
                                melds.push(userSpecifiedPairs[0].clone());
                                if (hand.mostRecentTile().equals(tile)) {
                                    winningMeldIndex = melds.length - 1;
                                }
                                melds.push(userSpecifiedPairs[1].clone());
                            } else if (hand.mostRecentTile().equals(tile)) {
                                melds.push(new Pair(tile, !hand.mostRecentTileIsSelfDrawn()));
                                winningMeldIndex = melds.length - 1;
                                melds.push(new Pair(tile));
                            } else {
                                melds.push(new Pair(tile));
                                melds.push(new Pair(tile));
                            }
                        }
                    }
                }
            }
            if (!meldsNotNullAndCorrectLength(melds, 7) || winningMeldIndex === -1) {
                return [];
            }

            if (hand.userSpecifiedMelds.length > 0 && !meldsAreSubset(melds, hand.userSpecifiedMelds)) {
                return [];
            }

            return [new MeldBasedWinningHand(melds, winningMeldIndex, 
                hand.mostRecentTile(), hand.flowerTiles)];
        }
        return [];
    }
}