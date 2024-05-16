import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import Pong, { meldIsPong } from "model/meld/pong";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { createMeldsExistPredicate, createMeldCheckerSuccessesQuantityGTEPredicate } from "service/point/predicate/factory/meld/meldPredicateFactoryBase";

// Checks that pongs exist in the winning hand for each single tile in tiles
export function createPongsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[], numPongsToMatch?: number) : PointPredicate<StandardWinningHand> {
    const tileQuantityMap = new TileToQuantityMap(tiles);
    for (const tile of tiles) {
        if (tileQuantityMap.getQuantity(tile) * 3 > maxQuantityPerNonFlowerTile) {
            throw new Error(`Cannot create a predicate of more than 1 pong for the same tile: ${tile.group} ${tile.value}.`)
        }
    }
    const pongsToMatch : Pong[] = [];
    for (const tile of tiles) {
        pongsToMatch.push(new Pong(tile));
    }

    if (numPongsToMatch && (numPongsToMatch > tiles.length || numPongsToMatch < 0)) {
        throw new Error(`numPairsToMatch must be between 0 and tiles.length (${tiles.length})`);
    }
    
    return createMeldsExistPredicate(pointPredicateID, pongsToMatch, numPongsToMatch ?? tiles.length);
}

export function createPongQuantityPredicate(pointPredicateID : string, minNumPongs: number) : PointPredicate<StandardWinningHand> {
    return createMeldCheckerSuccessesQuantityGTEPredicate(pointPredicateID, meldIsPong, minNumPongs);
}