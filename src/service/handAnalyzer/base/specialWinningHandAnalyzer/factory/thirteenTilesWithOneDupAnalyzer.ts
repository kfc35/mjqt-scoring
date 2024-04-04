import { Hand } from "model/hand/hk/hand";
import { handMinLengthWithoutFlowers } from "model/hand/hk/handConstants";
import { type HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Pair from "model/meld/pair";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { assertTilesSuitedOrHonor, tilesUnique } from "common/tileUtils";
import { assertTilesNotNullAndCorrectLength } from "common/tileUtils";
import { meldExistsInMelds } from "common/meldUtils";

export function constructThirteenTilesWithOneDupAnalyzer(thirteenUniqueTiles: SuitedOrHonorTile[]): HandAnalyzer<SpecialWinningHand> {
    assertTilesSuitedOrHonor(thirteenUniqueTiles);
    assertTilesNotNullAndCorrectLength(thirteenUniqueTiles, handMinLengthWithoutFlowers - 1, handMinLengthWithoutFlowers - 1);
    if (!tilesUnique(thirteenUniqueTiles)) {
        throw new Error("There can only be one of each tile in thirteenUniqueTiles");
    }
    return (hand: Hand) => {
        let pair: Pair | undefined = undefined;
        const tiles: SuitedOrHonorTile[] = [];
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
                tiles.push(tile);
            }
        }
        if (pair === undefined || tiles.length !== handMinLengthWithoutFlowers - 1) {
            return [];
        }
        // if pre-specified melds exist, it can only be the pair we found.
        if (!hand.userSpecifiedMelds || !(hand.userSpecifiedMelds.length === 1 && meldExistsInMelds(hand.userSpecifiedMelds, pair, false))) {
            return [];
        }
        return [new SpecialWinningHand([[...tiles], [...pair.tiles]], hand.mostRecentTile(), hand.mostRecentTileIsSelfDrawn(), hand.flowerTiles)];
    };
}