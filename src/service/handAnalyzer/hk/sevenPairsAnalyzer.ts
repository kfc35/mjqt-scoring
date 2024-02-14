import { HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { Hand } from "model/hand/hk/hand";
import Meld from "model/meld/meld";
import Pair from "model/meld/pair";
import { isSuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { StandardWinningHand } from "model/hand/hk/standardWinningHand";

export const sevenPairsAnalyzer = constructSevenPairsAnalyzer();

function constructSevenPairsAnalyzer() : HandAnalyzer {
    return (hand: Hand) => {
        if (hand.getQuantityPerUniqueTile().every(quantity => quantity % 2 === 0)) {
            const melds : Meld[] = [];
            for (const [quantity, tileArray] of hand.getQuantityToTileMap().entries()) {
                if (quantity === 2) {
                    for (const tile of tileArray) {
                        if (isSuitedOrHonorTile(tile)) {
                            melds.push(new Pair(tile));
                        }
                    }
                }
                if (quantity === 4) {
                    for (const tile of tileArray) {
                        if (isSuitedOrHonorTile(tile)) {
                            melds.push(new Pair(tile));
                            melds.push(new Pair(tile));
                        }
                    }
                }
            }
            return new StandardWinningHand(melds, hand.flowerTiles);
        }
        return undefined;
    }
}