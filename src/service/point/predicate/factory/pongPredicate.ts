import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Meld from "model/meld/meld";
import Pong, { meldIsPong } from "model/meld/pong";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { meldsIntersection } from "common/meldUtils";

// Checks that a pong exists in a winning hand for each single tile in tiles
export function createPongEqualityPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[]) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const pongs : Pong[] = [];
        for (const tile of tiles) {
            pongs.push(new Pong(tile));
        }
        const intersection : Meld[] = meldsIntersection(winningHand.getContents(), pongs, true);
        return new PointPredicateResult(pointPredicateID, intersection.length == pongs.length, intersection);
    }
}

export function createPongQuantityPredicate(pointPredicateID : string, numPongs: number) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const pongs : Pong[] = [];
        for (const meld of winningHand.getContents()) {
            if (meldIsPong(meld)) {
                pongs.push(meld);
            }
        }
        return new PointPredicateResult(pointPredicateID, pongs.length === numPongs, pongs);
    }
}