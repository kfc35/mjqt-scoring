import { Hand } from "model/hand/hk/hand";
import { handMinLengthWithoutFlowers } from "model/hand/hk/handConstants";
import { type HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Pair } from "model/meld/pair";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { assertTilesSuitedOrHonor, tilesUnique } from "common/tileUtils";
import { assertTilesNotNullAndCorrectLength, tilesDoesNotContainTile } from "common/tileUtils";
import { meldExistsInMelds } from "common/meldUtils";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { compareTiles } from "model/tile/tile";

export function constructThirteenTilesWithOneDupAnalyzer(thirteenUniqueTiles: SuitedOrHonorTile[]): HandAnalyzer<SpecialWinningHand> {
    assertTilesSuitedOrHonor(thirteenUniqueTiles);
    assertTilesNotNullAndCorrectLength(thirteenUniqueTiles, handMinLengthWithoutFlowers - 1, handMinLengthWithoutFlowers - 1);
    if (!tilesUnique(thirteenUniqueTiles)) {
        throw new Error("There can only be one of each tile in thirteenUniqueTiles");
    }
    return (hand: Hand) => {
        let pair: Pair | undefined = undefined;
        const twelveNonDups: SuitedOrHonorTile[] = [];
        if (hand.getTotalQuantity() !== handMinLengthWithoutFlowers) {
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
        if (pair === undefined || twelveNonDups.length !== handMinLengthWithoutFlowers - 1) {
            return [];
        }
        // if pre-specified melds exist, it can only be the pair we found (ignoring exposed flag)
        if (!!hand.userSpecifiedMelds && !(hand.userSpecifiedMelds.length === 1 && meldExistsInMelds(hand.userSpecifiedMelds, pair, false))) {
            return [];
        }
        const tiles = [[...twelveNonDups].sort(compareTiles), [...pair.tiles]];
        const indexOfWinningTile = tilesDoesNotContainTile(pair.tiles, hand.mostRecentTile()) ? 0 : 1;
        return [new SpecialWinningHand(tiles, indexOfWinningTile,
            hand.mostRecentTile(), indexOfWinningTile !== 1, hand.mostRecentTileIsSelfDrawn(), 
            hand.flowerTiles, SpecialWinningHandType.THIRTEEN_ORPHANS)];
    };
}