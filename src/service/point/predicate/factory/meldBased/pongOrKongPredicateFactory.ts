import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { createMeldsExistPredicateIgnoreExposed } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";

export function createPongOrKongsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[], 
    minNumPongsKongsToMatch: number, maxNumPongsKongsToMatch: number) : PointPredicate<MeldBasedWinningHand> {
    if (minNumPongsKongsToMatch < 0 || minNumPongsKongsToMatch > tiles.length) {
        throw new Error(`minNumPongsKongsToMatch must be between 0 and tiles.length (${tiles.length})`);
    }
    if (maxNumPongsKongsToMatch < 0 || maxNumPongsKongsToMatch > tiles.length) {
        throw new Error(`minNumPongsKongsToMatch must be between 0 and tiles.length (${tiles.length})`);
    }
    if (minNumPongsKongsToMatch > maxNumPongsKongsToMatch) {
        throw new Error(`minNumPongsKongsToMatch must be < maxNumPongsKongsToMatch`);
    }
    
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
    
    return createMeldsExistPredicateIgnoreExposed(pointPredicateID, [...pongsToMatch, ...kongsToMatch], 
        minNumPongsKongsToMatch, maxNumPongsKongsToMatch);
}