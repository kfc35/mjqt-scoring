import { Hand } from "model/hand/hk/hand";
import { handMinLengthWithoutFlowers } from "model/hand/hk/handConstants";
import { type HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Pair } from "model/meld/pair";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { assertTilesSuitedOrHonor, tilesUnique } from "common/tileUtils";
import { assertTilesNotNullAndCorrectLength, tilesDoesNotContainTile } from "common/tileUtils";
import { meldIsPair } from "model/meld/pair";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";

export function constructThirteenTilesWithOneDupAnalyzer(thirteenUniqueTiles: SuitedOrHonorTile[]): HandAnalyzer<SpecialWinningHand> {
    assertTilesSuitedOrHonor(thirteenUniqueTiles);
    assertTilesNotNullAndCorrectLength(thirteenUniqueTiles, 13, 13);
    if (!tilesUnique(thirteenUniqueTiles)) {
        throw new Error("There can only be one of each tile in thirteenUniqueTiles");
    }
    return (hand: Hand) => {
        let pair: Pair | undefined = undefined;
        const twelveNonDups: SuitedOrHonorTile[] = [];
        if (hand.getTotalQuantity(false) !== handMinLengthWithoutFlowers) {
            return [];
        }
        for (const tile of thirteenUniqueTiles) {
            const quantity = hand.getQuantity(tile);
            if (quantity < 1 || quantity > 2) {
                return [];
            }
            if (quantity === 2 && !!pair) { // has more than one pair
                return [];
            }
            if (quantity === 2) {
                pair = new Pair(tile);
            }
            else { // quantity === 1
                twelveNonDups.push(tile);
            }
        }
        if (pair === undefined || twelveNonDups.length !== 12) {
            return [];
        }
        // if pre-specified melds exist, it can only be the pair we found (ignoring exposed flag)
        if (hand.userSpecifiedMelds.length > 1) {
            return [];
        }
        if (hand.userSpecifiedMelds.length === 1) {
            if (!hand.userSpecifiedMelds[0]) {
                throw new Error('userSpecifiedMelds should all be defined.');
            }
            if (!(meldIsPair(hand.userSpecifiedMelds[0]) && pair.getFirstTile().equals(hand.userSpecifiedMelds[0].getFirstTile()))) {
                return [];
            }
        }
        const tiles = [[...twelveNonDups], [...pair.tiles]];
        const indexOfWinningTile = tilesDoesNotContainTile(pair.tiles, hand.mostRecentTile()) ? 0 : 1;
        return [new SpecialWinningHand(tiles, indexOfWinningTile,
            hand.mostRecentTile(), indexOfWinningTile === 1, hand.mostRecentTileIsSelfDrawn(), 
            hand.flowerTiles, SpecialWinningHandType.THIRTEEN_ORPHANS)];
    };
}