import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Meld from "model/meld/meld";
import Pong, { meldIsPong } from "model/meld/pong";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { meldsIntersection } from "common/meldUtils";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";

// Checks that pongs exist in the winning hand for each single tile in tiles
export function createPongsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[]) : PointPredicate<StandardWinningHand> {
    const tileQuantityMap = new TileToQuantityMap(tiles);
    for (const tile of tiles) {
        if (tileQuantityMap.getQuantity(tile) * 3 > maxQuantityPerNonFlowerTile) {
            throw new Error(`Cannot create a predicate of more than 1 pong for the same tile: ${tile.group} ${tile.value}.`)
        }
    }
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