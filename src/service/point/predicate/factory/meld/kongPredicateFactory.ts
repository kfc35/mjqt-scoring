import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Kong from "model/meld/kong";
import Meld from "model/meld/meld";
import { meldsIntersection } from "common/meldUtils";
import { meldIsKong } from "model/meld/kong";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";

// Checks that a kong exists in a winning hand for each single tile in tiles
export function createKongsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[]) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const kongs : Kong[] = [];
        for (const tile of tiles) {
            kongs.push(new Kong(tile));
        }
        const intersection : Meld[] = meldsIntersection(winningHand.getMelds(), [kongs], true);
        return new PointPredicateResult(pointPredicateID, intersection.length == kongs.length, [intersection]);
    }
}

export function createKongMinQuantityPredicate(pointPredicateID : string, minNumKongs: number) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const kongs : Kong[] = [];
        for (const meld of winningHand.getMelds()) {
            if (meldIsKong(meld)) {
                kongs.push(meld);
            }
        }
        return new PointPredicateResult(pointPredicateID, kongs.length >= minNumKongs, [kongs]);
    }
}