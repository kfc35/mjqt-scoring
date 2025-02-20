import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import Pair, { meldIsPair } from "model/meld/pair";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { createMeldsExistPredicateIgnoreExposed, createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";

// Checks that the pairs exist in a winning hand for each single tile in tiles.
// You can have dups in tiles, but only max 2 since you can only have max 2 pairs of a tile.
export function createPairsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[], minNumPairsToMatch?: number, maxNumPairsToMatch?: number) : PointPredicate<MeldBasedWinningHand> {
    if (!!minNumPairsToMatch && (minNumPairsToMatch < 0 || minNumPairsToMatch > tiles.length)) {
        throw new Error(`minNumPairsToMatch must be between 0 and tiles.length (${tiles.length})`);
    }
    if (!!maxNumPairsToMatch && (maxNumPairsToMatch < 0 || maxNumPairsToMatch > tiles.length)) {
        throw new Error(`maxNumPairsToMatch must be between 0 and tiles.length (${tiles.length})`);
    }
    if (!!minNumPairsToMatch && !!maxNumPairsToMatch && (minNumPairsToMatch > maxNumPairsToMatch)) {
        throw new Error(`minNumPairsToMatch must be < maxNumPairsToMatch`);
    }
    
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

    return createMeldsExistPredicateIgnoreExposed(pointPredicateID, pairsToMatch, minNumPairsToMatch, maxNumPairsToMatch);
}

export function createPairQuantityPredicate(pointPredicateID : string, numMinPairs: number, numMaxPairs: number | undefined = numMinPairs) : PointPredicate<MeldBasedWinningHand> {
    return createMeldCheckerSuccessesQuantityPredicate(pointPredicateID, meldIsPair, numMinPairs, numMaxPairs);
}