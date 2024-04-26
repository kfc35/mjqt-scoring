import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Pair, { meldIsPair } from "model/meld/pair";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { Tile } from "model/tile/tile";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";

// Checks that the pairs exist in a winning hand for each single tile in tiles.
// You can have dups in tiles
export function createPairsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[]) : PointPredicate<StandardWinningHand> {
    const tileQuantityMap = new TileToQuantityMap(tiles);
    for (const tile of tiles) {
        if (tileQuantityMap.getQuantity(tile) > 2) {
            throw new Error(`Cannot create a predicate of more than 2 pairs for the same tile: ${tile.group} ${tile.value}.`)
        }
    }

    const pairsToMatch : Pair[] = [];
    for (const tile of tiles) {
        pairsToMatch.push(new Pair(tile));
    }

    return (winningHand : StandardWinningHand) => {
        /* 
        If a desired pair exists multiple times, we capture every possibility as a separate set of indices
        If there are multiple pairs to match on, the possibile combinations increases multiplicatively
            E.g, if you have a seven pairs hand with the pairs A, A, B, B, C, C, and D
            And you want to ensure one pair of A and one of pair B exist,
            The resulting matching meld indices set will be [[1, 3], [1, 4], [2, 3], [2, 4]].
            If you want to ensure one pair of A, one pair of B, and one pair of C exist with the same hand, you get:
            [[1,3,5], [1,3,6], [1,4,5], [1,4,6], [2,3,5], [2,3,6], [2,4,5], [2,4,6]].
        */
        const matchedPairsIndex : Set<number> = new Set();
        let pairIndicesSet: Set<Set<number>> = new Set();
        for (const [pairIndex, pairToMatch] of pairsToMatch.entries()) {
            const matchedIndices : Set<number>= new Set();
            for (const [index, meld] of winningHand.getMelds().entries()) {
                if (pairToMatch.equalsIgnoreExposed(meld)) {
                    matchedIndices.add(index);
                }
            }
            if (pairIndicesSet.size === 0) { // add initial pairIndices
                matchedIndices.forEach(index => {
                    pairIndicesSet.add(new Set<number>().add(index))
                });
                matchedPairsIndex.add(pairIndex);
            } else { // the Cartesian product of matchedindices with pairIndices should be the new pairIndices
                // e.g. [[a],[b]], new matches [c] results in [[a,c], [b,c]]
                // e.g. [[a],[b]], new matches [c, d] result in [[a,c], [a,d], [b,c], [b,d]].
                const newPairIndicesSet : Set<Set<number>> = new Set();
                pairIndicesSet.forEach(pairIndices => 
                    matchedIndices.forEach(index => {
                        const newPairIndices = new Set<number>([...pairIndices]);
                        if (!newPairIndices.has(index)) {
                            newPairIndices.add(index);
                            newPairIndicesSet.add(newPairIndices);
                        }
                    })
                );
                if (newPairIndicesSet.size > 0) {
                    pairIndicesSet = newPairIndicesSet;
                    matchedPairsIndex.add(pairIndex);
                }
            }
        }

        const dedupedCorrectPairIndicesSet: Set<Set<number>> = new Set();
        for (const pairIndices of pairIndicesSet) {
            if (pairIndices.size !== pairsToMatch.length) {
                continue;
            }
            let isDup = false;
            for (const checkEquality of dedupedCorrectPairIndicesSet) {
                isDup = pairIndices.size === checkEquality.size && [...pairIndices].every(index => checkEquality.has(index));
                if (isDup) {
                    break;
                }
            }
            if (!isDup) {
                dedupedCorrectPairIndicesSet.add(pairIndices);
            }
        }

        if ([...dedupedCorrectPairIndicesSet].every(pairIndices => pairIndices.size === pairsToMatch.length)) {
            return new PointPredicateResult(pointPredicateID, true, [pairsToMatch.map(pair => pair.tiles)], dedupedCorrectPairIndicesSet, []]);
        }
        
        // then generate matched tiles after getting rid of dups?
        return new PointPredicateResult(pointPredicateID, false, , );
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
        return new PointPredicateResult(pointPredicateID, matchedTiles.length >= numMinPairs, [matchedTiles], new Set<Set<number>>().add(pairIndices), []);
    }
}