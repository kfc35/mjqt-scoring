import { Meld } from "model/meld/meld";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { getOnlyTruthyElement } from "common/generic/setUtils";
import { getMeldsSubsetFromIndicesSet } from "common/meldUtils";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultMeldDetailBuilder } from "model/point/predicate/result/meldBased/pointPredicateFailureResultMeldDetail";
import { PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultMeldDetailBuilder } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";

/* Evaluates whether the winning hand has each meld in meldsToMatch. The PointPredicate succeeds if there are between minNumMatches and maxNumMatches matches. 
   If both minNumMatches and maxNumMatches are undefined, meldsToMatch must all be found in the winning hand */
export function createMeldsExistPredicateIgnoreExposed(pointPredicateID : string, meldsToMatch: Meld[], minNumMatches?: number, maxNumMatches?: number) : PointPredicate<MeldBasedWinningHand> {
    if (!minNumMatches && !maxNumMatches) {
        minNumMatches = meldsToMatch.length;
        maxNumMatches = meldsToMatch.length;
    }
    if (!!minNumMatches && minNumMatches < 0) {
        throw new Error(`minNumMatches ${minNumMatches} must be >= 0`);
    }
    if (!!maxNumMatches && (maxNumMatches < 0 || maxNumMatches > meldsToMatch.length)) {
        throw new Error(`maxNumMatches ${maxNumMatches} must be >= 0 and <= meldsToMatch.length ${meldsToMatch.length}`);
    }
    if (!!minNumMatches && !!maxNumMatches && minNumMatches > maxNumMatches) {
        throw new Error(`minNumMatches ${minNumMatches} must be greater than maxNumMatches ${maxNumMatches}`);
    }
    return (winningHand : MeldBasedWinningHand) => {
        const [indicesSubsets, meldsToMatchGotMatchSuccessfully] = getMatchingIndicesSubsetsIgnoreExposed(winningHand.melds, meldsToMatch);
        if (indicesSubsets.size > 1) {
            throw new Error('indicesSubsets.size > 1 is currently not supported.');
        }
        const indicesSubset = (indicesSubsets.size === 0 ? new Set<number>() : getOnlyTruthyElement(indicesSubsets));
        const meldsThatSatisfyPredicate = getMeldsSubsetFromIndicesSet(winningHand.melds, indicesSubset);
        
        if (!!minNumMatches && indicesSubset.size < minNumMatches) {
            const missingMelds: Meld[] = meldsToMatch.filter((_meld, index) => !meldsToMatchGotMatchSuccessfully[index]);
            return new PointPredicateFailureResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetailBuilder()
                        .meldsThatPartiallySatisfyPredicate(meldsThatSatisfyPredicate)
                        .meldIndicesThatPartiallySatisfyPredicate(indicesSubset)
                        .meldsThatAreMissingToSatisfyPredicate(missingMelds)
                        .build()
                )
                .build();
        } else if (!!maxNumMatches && indicesSubset.size > maxNumMatches) {
            return new PointPredicateFailureResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetailBuilder()
                        .meldsThatFailPredicate(meldsThatSatisfyPredicate)
                        .meldIndicesThatFailPredicate(indicesSubset)
                        .build()
                )
                .build();
        }

        return new PointPredicateSingleSuccessResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetailBuilder()
                        .meldsThatSatisfyPredicate(meldsThatSatisfyPredicate)
                        .meldIndicesThatSatisfyPredicate(indicesSubset)
                        .build()
                )
                .build();
    }
}

/* Evaluates meldChecker across all melds in the hand. 
 * The PointPredicate succeeds if at least numMinMeldsPass and at most numMaxMeldsPass melds pass the meldChecker. 
 * If numMinMeldsPass and numMaxMeldsPass are both undefined, every meld (incl. pair) must pass the checker. */
export function createMeldCheckerSuccessesQuantityPredicate(pointPredicateID : string, 
        meldChecker: (meld: Meld) => boolean,
        numMinMeldsPass?: number | undefined, numMaxMeldsPass? : number | undefined) : PointPredicate<MeldBasedWinningHand> {
    if (!!numMinMeldsPass && numMinMeldsPass < 0) {
        throw new Error(`numMinMeldsPass ${numMinMeldsPass} must not be negative`);
    }
    if (!!numMinMeldsPass && !!numMaxMeldsPass && numMinMeldsPass > numMaxMeldsPass) {
        throw new Error(`numMinMeldsPass ${numMinMeldsPass} must be greater than numMaxMeldsPass ${numMaxMeldsPass}`);
    }
    return (winningHand : MeldBasedWinningHand) => {
        const [successMelds, failedMelds, passingIndices, failingIndices] = checkMelds(winningHand.melds.map((meld, index) => [meld, index]), winningHand, meldChecker);
        if (!numMinMeldsPass && !numMaxMeldsPass && failedMelds.length > 0) {
            return new PointPredicateFailureResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetailBuilder()
                        .meldsThatPartiallySatisfyPredicate(successMelds)
                        .meldIndicesThatPartiallySatisfyPredicate(passingIndices)
                        .meldsThatFailPredicate(failedMelds)
                        .meldIndicesThatFailPredicate(failingIndices)
                        .build()
                )
                .build();
        } else if (!numMinMeldsPass && !numMaxMeldsPass) {
            return new PointPredicateSingleSuccessResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetailBuilder()
                        .meldsThatSatisfyPredicate(successMelds)
                        .meldIndicesThatSatisfyPredicate(passingIndices)
                        .build()
                )
                .build();
        }

        if ((!!numMinMeldsPass && successMelds.length < numMinMeldsPass)) {
            return new PointPredicateFailureResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetailBuilder()
                        .meldsThatPartiallySatisfyPredicate(successMelds)
                        .meldIndicesThatPartiallySatisfyPredicate(passingIndices)
                        .meldsThatFailPredicate(failedMelds)
                        .meldIndicesThatFailPredicate(failingIndices)
                        .build()
                )
                .build();
        } else if ((!!numMaxMeldsPass && successMelds.length > numMaxMeldsPass)) {
            return new PointPredicateFailureResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetailBuilder()
                        .meldsThatFailPredicate(successMelds) 
                        .meldIndicesThatFailPredicate(passingIndices)
                        .build()
                )
                .build();
        }
        return new PointPredicateSingleSuccessResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetailBuilder()
                        .meldsThatSatisfyPredicate(successMelds)
                        .meldIndicesThatSatisfyPredicate(passingIndices)
                        .build()
                )
                .build();
    }
}

/* Evaluates meldsChecker against the the whole list of melds in the hand included via meldFilter
 * Also evaluates filteredMeldChecker against each individual meld in the filtered list
 * By default, meldFilter includes all melds in the hand.
 * The PointPredicate succeeds if meldsChecker returns true, and filteredMeldChecker returns true for every meld that has passed the filter. */
export function createFilteredMeldsCheckerPredicate(pointPredicateID : string, 
    meldFilter: (meld: Meld) => boolean = () => true,
    meldsChecker: (melds: Meld[], winningHand: MeldBasedWinningHand) => boolean,
    filteredMeldChecker: (meld: Meld, winningHand: MeldBasedWinningHand) => boolean) : PointPredicate<MeldBasedWinningHand> {
    return (winningHand : MeldBasedWinningHand) => {
        const filteredMelds: [Meld, number][] = [];
        for (const [index, meld] of winningHand.melds.entries()) {
            if (meldFilter(meld)) {
                filteredMelds.push([meld, index]);
            }
        }

        if (meldsChecker(filteredMelds.map(([meld,]) => meld), winningHand)) {
            const [successMelds, failedMelds, passingIndices, failingIndices] = checkMelds(filteredMelds, winningHand, filteredMeldChecker);
            if (failedMelds.length === 0) {
                return new PointPredicateSingleSuccessResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetailBuilder()
                        .meldsThatSatisfyPredicate(successMelds)
                        .meldIndicesThatSatisfyPredicate(passingIndices)
                        .build()
                )
                .build();
            } else {
                return new PointPredicateFailureResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetailBuilder()
                        .meldsThatPartiallySatisfyPredicate(successMelds)
                        .meldIndicesThatPartiallySatisfyPredicate(passingIndices)
                        .meldsThatFailPredicate(failedMelds)
                        .meldIndicesThatFailPredicate(failingIndices)
                        .build()
                )
                .build();
            }
        } else { // the entire filtered melds array failed the largercheck
            return new PointPredicateFailureResultBuilder()
                .pointPredicateId(pointPredicateID)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetailBuilder()
                        .meldsThatFailPredicate(filteredMelds.map(([meld,]) => meld))
                        .meldIndicesThatFailPredicate(new Set(filteredMelds.map(([, index]) => index)))
                        .build()
                )
                .build();
        }
    }
}

function checkMelds(meldIndexTuples: readonly [Meld, number][], 
    winningHand: MeldBasedWinningHand, 
    meldChecker:(meld: Meld, winningHand: MeldBasedWinningHand) => boolean): [Meld[], Meld[], Set<number>, Set<number>] {
    const successMelds : Meld[] = [];
    const failedMelds : Meld[] = [];
    const passingIndices: Set<number> = new Set();
    const failingIndices: Set<number> = new Set();
    for (const [meld, index] of meldIndexTuples) {
        if (meldChecker(meld, winningHand)) {
            successMelds.push(meld);
            passingIndices.add(index);
        } else {
            failedMelds.push(meld);
            failingIndices.add(index);
        }
    }
    return [successMelds, failedMelds, passingIndices, failingIndices];
}

/** 
 * Returns a tuple of:
 *   0) the subsets of indices from "melds" that have a 1:1 match in "meldsToMatch".
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
 * 
 * If there are no matches, the first item in the tuple will be the empty set.
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