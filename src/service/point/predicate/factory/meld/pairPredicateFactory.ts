import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Pair, { meldIsPair } from "model/meld/pair";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { Tile } from "model/tile/tile";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { getMatchingIndicesSubsetsIgnoreExposed } from "common/meldUtils";

// Checks that the pairs exist in a winning hand for each single tile in tiles.
// You can have dups in tiles
export function createPairsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[]) : PointPredicate<StandardWinningHand> {
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

    return (winningHand : StandardWinningHand) => {
        const [pairIndicesSubsets, pairFoundMatch] = getMatchingIndicesSubsetsIgnoreExposed(winningHand.getMelds(), pairsToMatch);

        if ([...pairIndicesSubsets].every(pairIndices => pairIndices.size === pairsToMatch.length)) {
            return new PointPredicateResult(pointPredicateID, true, [pairsToMatch.map(pair => pair.tiles)], [], pairIndicesSubsets, []);
        }
        
        const successTiles : Tile[][][] = 
            [...pairIndicesSubsets].map((indicesSubsets) => {
                return [...indicesSubsets].map((meldIndex) => {
                    const meld = winningHand.getMelds()[meldIndex];
                    if (meld) {
                        return meld.tiles;
                    }
                    return []; // this should not happen.
                }).filter(tiles => !!tiles && tiles.length !== 0);
            });
        return new PointPredicateResult(pointPredicateID, false, successTiles, 
        pairsToMatch.map((pair, index) => pairFoundMatch[index] ? pair.tiles : []).filter(tiles => !!tiles && tiles.length !== 0), 
        pairIndicesSubsets, []);
    }
}

export function createPairQuantityGTEPredicate(pointPredicateID : string, numMinPairs: number) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const matchedTiles : Tile[][] = [];
        const pairIndices: Set<number> = new Set();
        for (const [index, meld] of winningHand.getMelds().entries()) {
            if (meldIsPair(meld)) {
                matchedTiles.push([...meld.tiles]);
                pairIndices.add(index);
            }
        }
        return new PointPredicateResult(pointPredicateID, matchedTiles.length >= numMinPairs, [matchedTiles], [], new Set<Set<number>>().add(pairIndices), []);
    }
}