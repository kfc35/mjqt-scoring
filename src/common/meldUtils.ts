import Meld from "model/meld/meld";
import { Tile } from "model/tile/tile";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { meldIsPair } from "model/meld/pair";
import { meldIsKong } from "model/meld/kong";

export function meldsNotNullAndCorrectLength(melds: Meld[], length: number): boolean {
    return (melds && melds.every(meld => !!meld) && melds.length === length);
}

export function meldsHasOnePair(melds: Meld[]): boolean {
    const pairs = melds.filter(meld => meldIsPair(meld));
    return pairs.length === 1;
}

export function meldsNumKongs(melds: Meld[]): number {
    const kongs = melds.filter(meld => meldIsKong(meld));
    return kongs.length;
}

export function meldsNumTiles(melds: Meld[]) : number {
    return melds.map(meld => meld.tiles.length).reduce<number>((sum, len) => sum + len, 0);
}

export function toTiles(melds: Meld[]) : SuitedOrHonorTile[] {
    return melds.map(meld => meld.tiles)
        .reduce<SuitedOrHonorTile[]>((accum, tiles) => accum.concat(tiles), []);
}

export function meldHasTile(meld: Meld, tile: Tile) : boolean {
    for (const meldTile of meld.tiles) {
        if (meldTile.equals(tile)) {
            return true;
        }
    }
    return false;
}

export function meldsAreSubset(melds: Meld[], potentialSubset: Meld[], ignoreExposed? : boolean) : boolean {
    const haystack = [...melds];
    for (const needle of potentialSubset) {
        let found = false;
        for (let i = 0; i < haystack.length; i++) {
            if (needle.equals(haystack[i], ignoreExposed)) {
                haystack.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}

export function meldsIntersection(meldsOne: readonly Meld[], meldsTwo: readonly Meld[], ignoreExposed? : boolean) : Meld[] {
    const intersection = [];
    const meldsTwoCopy = [...meldsTwo];
    for (const meldOne of meldsOne) {
        for (let i = 0; i < meldsTwoCopy.length; i++) {
            if (meldOne.equals(meldsTwoCopy[i], ignoreExposed)) {
                intersection.push(meldOne.clone());
                meldsTwoCopy.splice(i, 1)
                break;
            }
        }
    }
    return intersection;
}

export function meldExistsInMelds(melds: Meld[], meldToCheck: Meld, ignoreExposed?: boolean) : boolean {
    for (const meld of melds) {
        if (meld.equals(meldToCheck, ignoreExposed)) {
            return true;
        }
    }
    return false;
}

export function cartesianProduct(meldsOne: Meld[][], meldsTwo: Meld[][]) : Meld[][] {
    if (meldsOne.length === 0) {
        return meldsTwo; // might also have length = 0, that is fine.
    }
    if (meldsTwo.length === 0) {
        return meldsOne;
    }
    const product : Meld[][] = [];
    for (const meldOne of meldsOne) {
        for (const meldTwo of meldsTwo) {
            product.push([...meldOne, ...meldTwo]);
        }
    }
    return product;
}


export function getMatchingIndicesSubsetsIgnoreExposed(melds: Meld[], meldsToMatch: Meld[]) : [Set<Set<number>>, boolean[]] {
    return getMatchingIndicesSubsets(melds, meldsToMatch, true);
}

/** 
 * Returns:
 *   the subsets indices from "melds" that have a 1:1 match in "meldsToMatch".
 *   a matchSuccessful array where, for each index in meldsToMatch, matchSuccessful[index] = true if there is a match for it.
 * Each "meldToMatch" will only match once with a meld in "melds" per subset, and vice versa per subset.
 * If you want to match the same meld multiple times, you must include a copy of that meld in "meldsToMatch".
 *   i.e. if meldsToMatch is [A], and melds contains [A, A, B, C, D], this function will return [[0], [1]] as the subsets 
 *     and [true] as the boolean array
 *   if meldsToMatch is [A, A], and melds contains [A, A, B, C, D], this function will return [[0, 1]] as the subsets 
 *     and [true, true] as the boolean array. (note that [1, 0] is deduped out)
 * If meldsToMatch is [A, A], but melds contains [A, B, C, D, E], this function will return [[0]] as the subsets 
 *   and [true, false] as the boolean array (the second A meld was not matched).
 * Since a "meld to match" can match multiple melds in "melds", the return object
 * can return multiple subsets of indices. These subsets will be deduped.
 * 
 * To clarify the functionality further, here is another example with a seven pairs hand:
 * If a desired pair exists multiple times, we capture every possibility as a separate set of indices
 * If there are multiple pairs to match on, the possibile combinations increases multiplicatively
 * E.g, if you have a seven pairs hand with the pairs [A, A, B, B, C, C, D]
 * And you want to ensure one pair of A and one of pair B exist (meldsToMatch = [A, B])
 * The resulting matching meld indices set will be [[0, 2], [0, 3], [1, 2], [1, 3]].
 * If you want to ensure one pair of A, one pair of B, and one pair of C exist with the same hand (meldsToMatch = [A, B, C]), you get: 
 * [[0,2,4], [0,2,5], [0,3,4], [0,3,5], [1,2,4], [1,2,5], [1,3,4], [1,3,5]].
*/
export function getMatchingIndicesSubsets(melds: Meld[], meldsToMatch: Meld[], ignoreExposed?: boolean): [Set<Set<number>>, boolean[]]  {
    let matchingIndicesSubsets: Set<Set<number>> = new Set();
    const meldsToMatchSuccess: boolean[] = meldsToMatch.map(() => false);
    for (const [toMatchIndex, toMatchMeld] of meldsToMatch.entries()) {
        const matchedIndices : Set<number>= new Set();
        for (const [index, meld] of melds.entries()) {
            if (toMatchMeld.equals(meld, ignoreExposed)) {
                matchedIndices.add(index);
            }
        }
        if (matchingIndicesSubsets.size === 0) { // add initial subset
            matchedIndices.forEach(index => {
                matchingIndicesSubsets.add(new Set<number>().add(index))
            });
            meldsToMatchSuccess[toMatchIndex] = true;
        } else { // the Cartesian product of matchedIndices with the existing indicesSubsets becomes the new matchingIndicesSubsets
            // sets should be deduped where necessary
            // e.g. [[a],[b]], new matches [c] results in [[a,c], [b,c]]
            // e.g. [[a],[b]], new matches [c, d] results in [[a,c], [a,d], [b,c], [b,d]].
            // e.g. [[a],[b]], new matches [a, b] results in [[a,b], [b,a]] (the subsets will be deduped further down into [[a,b]])
            const newMatchingIndicesSubsets : Set<Set<number>> = new Set();
            matchingIndicesSubsets.forEach(existingSubset => 
                matchedIndices.forEach(index => {
                    if (!existingSubset.has(index)) {
                        const newIndicesSubset = new Set<number>([...existingSubset, index]);
                        newMatchingIndicesSubsets.add(newIndicesSubset);
                    } // a meld in melds cannot be matched multiple times in the same subset, so it should be skipped.
                })
            );
            if (newMatchingIndicesSubsets.size > 0) { // the match is new and valid
                matchingIndicesSubsets = newMatchingIndicesSubsets;
                meldsToMatchSuccess[toMatchIndex] = true;
            }
        }
    }

    return [dedup(matchingIndicesSubsets), meldsToMatchSuccess];
}

function dedup(setsOfIndices: Set<Set<number>>) : Set<Set<number>> {
    const dedupedSetsOfSubsets: Set<Set<number>> = new Set();
    for (const indices of setsOfIndices) {
        let isDup = false;
        for (const checkEquality of dedupedSetsOfSubsets) {
            isDup = indices.size === checkEquality.size && [...indices].every(index => checkEquality.has(index));
            if (isDup) {
                break;
            }
        }
        if (!isDup) {
            dedupedSetsOfSubsets.add(indices);
        }
    }
    return dedupedSetsOfSubsets;
}