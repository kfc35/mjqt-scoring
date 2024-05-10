import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Pair, { meldIsPair } from "model/meld/pair";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { createMeldsExistPredicate, createMeldCheckerSuccessesQuantityGTEPredicate } from "service/point/predicate/factory/meld/meldPredicateFactoryBase";

// Checks that the pairs exist in a winning hand for each single tile in tiles.
// You can have dups in tiles, but only max 2 since you can only have max 2 pairs of a tile.
export function createPairsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[], numPairsToMatch: number) : PointPredicate<StandardWinningHand> {
    const tileQuantityMap = new TileToQuantityMap(tiles);
    for (const tile of tiles) {
        if (tileQuantityMap.getQuantity(tile) * 2 > maxQuantityPerNonFlowerTile) {
            throw new Error(`Cannot create a predicate of more than 2 pairs for the same tile: ${tile.group} ${tile.value}.`)
        }
    }

    const pairsToMatch : Pair[] = [];
    for (const tile of tiles) {
        pairsToMatch.push(new Pair(tile));
    }

    return createMeldsExistPredicate(pointPredicateID, pairsToMatch, numPairsToMatch);
}

export function createPairQuantityGTEPredicate(pointPredicateID : string, numMinPairs: number) : PointPredicate<StandardWinningHand> {
    return createMeldCheckerSuccessesQuantityGTEPredicate(pointPredicateID, meldIsPair, numMinPairs);
}