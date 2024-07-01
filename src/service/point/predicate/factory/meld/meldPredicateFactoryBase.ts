import { Tile } from "model/tile/tile";
import Meld from "model/meld/meld";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { wrapSet } from "common/generic/setUtils";
import { toTiles } from "common/meldUtils";

/* Evaluates whether the winning hand has each meld in meldsToMatch. The PointPredicate succeeds if there are at least numMinMatches matches. */
export function createMeldsExistPredicate(pointPredicateID : string, meldsToMatch: Meld[], numMinMatches: number) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const [indicesSubsets, meldFoundMatch] = getMatchingIndicesSubsetsIgnoreExposed(winningHand.getMelds(), meldsToMatch);

        if ([...indicesSubsets].every(pairIndices => pairIndices.size >= numMinMatches)) {
            return new PointPredicateResult(pointPredicateID, true, [meldsToMatch.map(pair => pair.tiles)], [], [], indicesSubsets, []);
        }
        
        const successTiles : Tile[][][] = 
            [...indicesSubsets].map((indicesSubset) => getTilesFromMeldsAndIndices(winningHand.getMelds(), indicesSubset));
        // TODO missingTiles
        return new PointPredicateResult(pointPredicateID, false, successTiles, getTilesFromMeldsAndIncludeFlagArray(meldsToMatch, meldFoundMatch), [], 
        indicesSubsets, []);
    }
}

/* Evaluates meldChecker across all melds in the hand. 
 * The PointPredicate succeeds if at least numMinMeldsPass and at most numMaxMeldsPass melds pass the meldChecker. 
 * If numMinMeldsPass and numMaxMeldsPass are both undefined, every meld must pass the checker. */
export function createMeldCheckerSuccessesQuantityPredicate(pointPredicateID : string, 
        meldChecker: (meld: Meld) => boolean,
        numMinMeldsPass?: number | undefined, numMaxMeldsPass? : number | undefined) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const [successTiles, failedTiles, passingIndices] = checkMelds(winningHand.getMelds().map((meld, index) => [meld, index]), meldChecker);
        if (!numMinMeldsPass && !numMaxMeldsPass && failedTiles.length > 0) {
            return new PointPredicateResult(pointPredicateID, false, [], failedTiles, [], wrapSet(passingIndices), []);
        } else if (!numMinMeldsPass && !numMaxMeldsPass) {
            return new PointPredicateResult(pointPredicateID, true, [successTiles], [], [], wrapSet(passingIndices), []);
        }

        if ((!!numMinMeldsPass && successTiles.length >= numMinMeldsPass) && (!!numMaxMeldsPass && successTiles.length <= numMaxMeldsPass)) {
            return new PointPredicateResult(pointPredicateID, true, [successTiles], [], [], wrapSet(passingIndices), []);
        }
        return new PointPredicateResult(pointPredicateID, false, [], failedTiles, [], wrapSet(passingIndices), []);
    }
}

/* Evaluates meldsChecker across all the filtered melds in the hand. 
 * The PointPredicate succeeds if meldsChecker returns true, and filteredMeldChecker returns true for every meld that has passed the filter. */
export function createFilteredMeldsCheckerSuccessesQuantityPredicate(pointPredicateID : string, 
    meldFilter: (meld: Meld) => boolean = () => true,
    meldsChecker: (melds: Meld[]) => boolean,
    filteredMeldChecker: (meld: Meld) => boolean) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const filteredMelds: [Meld, number][] = [];
        for (const [index, meld] of winningHand.getMelds().entries()) {
            if (meldFilter(meld)) {
                filteredMelds.push([meld, index]);
            }
        }

        if (meldsChecker(filteredMelds.map(([meld,]) => meld))) {
            const [successTiles, failedTiles, passingIndices] = checkMelds(filteredMelds, filteredMeldChecker);
            if (failedTiles.length === 0) {
                return new PointPredicateResult(pointPredicateID, true, [successTiles], [], [], wrapSet(passingIndices), []);
            } else {
                return new PointPredicateResult(pointPredicateID, false, [], failedTiles, [], wrapSet(passingIndices), []);
            }
        } else { // the entire melds array failed the check, so consider all the melds to be failed tiles.
            const tiles = toTiles(filteredMelds.map(([meld,]) => meld));
            return new PointPredicateResult(pointPredicateID, false, [], tiles, [], new Set(), []);
        }
    }
}

function checkMelds(meldIndexTuples: readonly [Meld, number][], meldChecker:(meld: Meld) => boolean): [Tile[][], Tile[][], Set<number>] {
    const successTiles : Tile[][] = [];
    const failedTiles : Tile[][] = [];
    const passingIndices: Set<number> = new Set();
    for (const [meld, index] of meldIndexTuples) {
        if (meldChecker(meld)) {
            successTiles.push([...meld.tiles]);
            passingIndices.add(index);
        } else {
            failedTiles.push([...meld.tiles]);
        }
    }
    return [successTiles, failedTiles, passingIndices];
}

/** 
 * Returns a tuple of:
 *   0) the subsets indices from "melds" that have a 1:1 match in "meldsToMatch".
 *   1) a matchSuccessful array where, for each index in meldsToMatch, matchSuccessful[index] = true if there was a match for it.
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
function getMatchingIndicesSubsets(melds: readonly Meld[], meldsToMatch: Meld[], ignoreExposed?: boolean): [Set<Set<number>>, boolean[]]  {
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

function getMatchingIndicesSubsetsIgnoreExposed(melds: readonly Meld[], meldsToMatch: Meld[]) : [Set<Set<number>>, boolean[]] {
    return getMatchingIndicesSubsets(melds, meldsToMatch, true);
}

function getTilesFromMeldsAndIndices(melds: readonly Meld[], meldIndices : Set<number>) : Tile[][] {
    if (![...meldIndices].every(index => index < melds.length && index > -1)) {
        throw new Error("Every meld index must be < melds.length and > -1.");
    }
    return [...meldIndices].map((meldIndex) => {
        const meld = melds[meldIndex];
        if (meld) {
            return meld.tiles;
        }
        return []; // this should not happen.
    }).filter(tiles => !!tiles && tiles.length !== 0);
}

function getTilesFromMeldsAndIncludeFlagArray(melds: readonly Meld[], includeFlagArray: boolean[]) : Tile[][] {
    if (includeFlagArray.length !== melds.length) {
        throw new Error("melds and includeFlagArray arrays must be of same length.");
    }
    return [...includeFlagArray].map((includeMeld, meldIndex) => {
        const meld = melds[meldIndex];
        if (includeMeld && !!meld) {
            return meld.tiles;
        }
        return []; // this should not happen.
    }).filter(tiles => !!tiles && tiles.length !== 0);
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