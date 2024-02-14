import { TileToQuantityMap } from "model/hand/hk/tileQuantityMap";
import { Tile } from "model/tile/tile";
import { Hand } from "model/hand/hk/hand";
import { handMinLength } from "model/hand/hk/handUtils";
import { type HandAnalyzer } from "service/handAnalyzer/hk/handAnalyzer";

export function constructThirteenTilesWithOneDupAnalyzer(thirteenUniqueTiles: Tile[]): HandAnalyzer {
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
        let hasOnePair: boolean = false;
        if (hand.getQuantityNonFlowerTiles() !== handMinLength) {
            return undefined;
        }
        for (const tile of thirteenUniqueTiles) {
            const quantity = hand.getQuantity(tile);
            if (quantity < 1 || quantity > 2) {
                return undefined;
            }
            if (quantity === 2 && hasOnePair) { // has more than one pair
                return undefined;
            }
            if (quantity === 2) {
                hasOnePair = true
            }
        }
        return undefined // TODO return something meaningful here
    };
}