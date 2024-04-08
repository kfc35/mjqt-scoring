import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Chow, { meldIsChow } from "model/meld/chow";
import SuitedTile from "model/tile/group/suitedTile";
import Meld from "model/meld/meld";
import { meldsIntersection } from "common/meldUtils";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { getNextSuitedTileValue } from "model/tile/tileValue";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";

// Checks that the given tile sequences exist as chows in a winning hand.
export function createChowsExistPredicateFromSequences(pointPredicateID : string, tileSequences: [SuitedTile, SuitedTile, SuitedTile][]) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const chows : Chow[] = [];
        for (const sequence of tileSequences) {
            if (sequence[0].group !== sequence[1].group 
                && sequence[1].group !== sequence[2].group
                && sequence[0].group !== sequence[2].group) {
                chows.push(new Chow(sequence, false, true));
            } else {
                chows.push(new Chow(sequence));
            }
        }
        const intersection : Meld[] = meldsIntersection(winningHand.getContents(), chows, true);
        return new PointPredicateResult(pointPredicateID, intersection.length == chows.length, intersection);
    }
}

// Creates tile sequences using the provided tiles as the lowest in the sequence, then checks for those sequences in the winning hand.
export function createChowsExistPredicateFromTiles(pointPredicateID : string, tiles: SuitedTile[]) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const chows : Chow[] = [];
        for (const tile of tiles) {
            const nextTileValue = getNextSuitedTileValue(tile.value);
            if (!nextTileValue) {
                throw new Error("Invalid tile provided. Tile must be earliest tile in the sequence, ");
            }
            const twoAfterTileValue = getNextSuitedTileValue(nextTileValue);
            if (!twoAfterTileValue) {
                throw new Error("Invalid tile provided. Tile must be earliest tile in the sequence, ");
            }
            const nextTile = constructSuitedTile(tile.group, nextTileValue);
            const twoAfterTile = constructSuitedTile(tile.group, twoAfterTileValue);
            const sequence: [SuitedTile, SuitedTile, SuitedTile] = 
                [tile, nextTile, twoAfterTile]
            chows.push(new Chow(sequence));
        }
        const intersection : Meld[] = meldsIntersection(winningHand.getContents(), chows, true);
        return new PointPredicateResult(pointPredicateID, intersection.length == chows.length, intersection);
    }
}

export function createChowQuantityPredicate(pointPredicateID : string, numChows: number) : PointPredicate<StandardWinningHand> {
    return (winningHand : StandardWinningHand) => {
        const chows : Chow[] = [];
        for (const meld of winningHand.getContents()) {
            if (meldIsChow(meld)) {
                chows.push(meld);
            }
        }
        return new PointPredicateResult(pointPredicateID, chows.length === numChows, chows);
    }
}