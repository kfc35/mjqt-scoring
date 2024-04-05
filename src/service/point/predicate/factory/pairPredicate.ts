import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { meldsIntersection } from "common/meldUtils";
import Pair, { meldIsPair } from "model/meld/pair";
import Meld from "model/meld/meld";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";

// Checks that a pair exists in a winning hand for each single tile in tiles
export function createPairEqualityPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[]) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const pairs : Pair[] = [];
        for (const tile of tiles) {
            pairs.push(new Pair(tile));
        }
        const intersection : Meld[] = meldsIntersection(winningHand.getContents(), pairs, true);
        return new PointPredicateResult(pointPredicateID, intersection.length == pairs.length, intersection);
    }
}

export function createPairQuantityPredicate(pointPredicateID : string, numPairs: number) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const pairs : Pair[] = [];
        for (const meld of winningHand.getContents()) {
            if (meldIsPair(meld)) {
                pairs.push(meld);
            }
        }
        return new PointPredicateResult(pointPredicateID, pairs.length === numPairs, pairs);
    }
}