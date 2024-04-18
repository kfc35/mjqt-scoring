import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Pair, { meldIsPair } from "model/meld/pair";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { Tile } from "model/tile/tile";

// Checks that the pairs exist in a winning hand for each single tile in tiles.
// you can have dups
export function createPairsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[]) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const pairsToMatch : Pair[] = [];
        const matchedPairsIndex : Set<number> = new Set();
        for (const tile of tiles) {
            pairsToMatch.push(new Pair(tile));
        }

        /* 
        If a desired pair exists multiple times, we capture every possibility as a separate set of indices
        If there are multiple pairs to match on, the possibile combinations increases multiplicatively
            E.g, if you have a seven pairs hand with the pairs A, A, B, B, C, C, and D
            And you want to ensure one pair of A and one of pair B exist,
            The resulting matching meld indices set will be [[1, 3], [1, 4], [2, 3], [2, 4]].
            If you want to ensure one pair of A, one pair of B, and one pair of C exist with the same hand, you get:
            [[1,3,5], [1,3,6], [1,4,5], [1,4,6], [2,3,5], [2,3,6], [2,4,5], [2,4,6]].
        */
        let pairIndicesSet: Set<Set<number>> = new Set();
        for (const [pairIndex, pairToMatch] of pairsToMatch.entries()) {
            const matches : Set<number>= new Set();
            for (const [index, meld] of winningHand.getMelds().entries()) {
                if (pairToMatch.equalsIgnoreExposed(meld)) {
                    matches.add(index);
                    matchedPairsIndex.add(pairIndex);
                }
            }
            if (pairIndicesSet.size === 0) {
                matches.forEach(index => {
                    pairIndicesSet.add(new Set<number>().add(index))
                });
            } else {
                const newPairIndicesSet : Set<Set<number>> = new Set();
                pairIndicesSet.forEach(pairIndices => 
                    matches.forEach(match => {
                        const newPairIndices = new Set<number>([...pairIndices]);
                        if (!newPairIndices.has(match)) {
                            newPairIndicesSet.add(newPairIndices.add(match));
                        }
                    })
                );

                pairIndicesSet = newPairIndicesSet;
            }
        }
        //remove dups, which can happen if you are looking for the same pair multiple times.
        const dedupedPairIndices: Set<Set<number>> = new Set();
        
        // then generate matched tiles after getting rid of dups?
        return new PointPredicateResult(pointPredicateID, intersection.length == pairs.length, intersection);
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