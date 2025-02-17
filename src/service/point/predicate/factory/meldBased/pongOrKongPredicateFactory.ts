import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import Pong, { meldIsPong } from "model/meld/pong";
import Kong, { meldIsKong } from "model/meld/kong";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { createMeldsExistPredicateIgnoreExposed, createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";

export function createPongOrKongsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[], numPongsKongsToMatch?: number) : PointPredicate<MeldBasedWinningHand> {
    const tileQuantityMap = new TileToQuantityMap(tiles);
    for (const tile of tiles) {
        if (tileQuantityMap.getQuantity(tile) * 4 > maxQuantityPerNonFlowerTile) {
            throw new Error(`Cannot create a predicate of more than 1 pong/kong for the same tile: ${tile.group} ${tile.value}.`)
        }
    }
    const pongsToMatch : Pong[] = [];
    const kongsToMatch : Kong[] = [];
    for (const tile of tiles) {
        pongsToMatch.push(new Pong(tile));
        kongsToMatch.push(new Kong(tile));
    }

    if (numPongsKongsToMatch && (numPongsKongsToMatch > tiles.length || numPongsKongsToMatch < 0)) {
        throw new Error(`numPairsToMatch must be between 0 and tiles.length (${tiles.length})`);
    }
    
    return createMeldsExistPredicateIgnoreExposed(pointPredicateID, [...pongsToMatch, ...kongsToMatch], (numPongsKongsToMatch ?? tiles.length) * 2);
}

export function createPongOrKongQuantityPredicate(pointPredicateID : string, minNumPongOrKongs: number) : PointPredicate<MeldBasedWinningHand> {
    return createMeldCheckerSuccessesQuantityPredicate(pointPredicateID, meld => meldIsPong(meld) || meldIsKong(meld), minNumPongOrKongs);
}