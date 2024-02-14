import { TileToQuantityMap } from "model/hand/hk/tileQuantityMap";
import { Hand } from "model/hand/hk/hand";
import { handMinLength } from "model/hand/hk/handUtils";
import { type HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Pair from "model/meld/pair";
import { SpecialWinningHand } from "model/hand/hk/specialWinningHand";

export function constructThirteenTilesWithOneDupAnalyzer(thirteenUniqueTiles: SuitedOrHonorTile[]): HandAnalyzer {
    if (thirteenUniqueTiles.length !== 13) {
        throw new Error("There must be exactly 13 tiles in thirteenUniqueTiles");
    }

    const exactThirteenTilesQuantityMap = new TileToQuantityMap(thirteenUniqueTiles);
    for (const tile of thirteenUniqueTiles) {
        if (exactThirteenTilesQuantityMap.getQuantity(tile) !== 1) {
            throw new Error("There can only be one of each tile in thirteenUniqueTiles");
        }
    }

    return (hand: Hand) => {
        let pair: Pair | undefined = undefined;
        const tiles: SuitedOrHonorTile[] = [];
        if (hand.getTotalQuantity() !== handMinLength) {
            return undefined;
        }
        for (const tile of thirteenUniqueTiles) {
            const quantity = hand.getQuantity(tile);
            if (quantity < 1 || quantity > 2) {
                return undefined;
            }
            if (quantity === 2 && !!pair) { // has more than one pair
                return undefined;
            }
            if (quantity === 2) {
                pair = new Pair(tile);
            }
            else { // quantity === 1
                tiles.push(tile);
            }
        }
        return new SpecialWinningHand(tiles, hand.flowerTiles, pair);
    };
}