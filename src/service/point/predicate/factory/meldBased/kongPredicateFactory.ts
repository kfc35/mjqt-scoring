import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { maxQuantityPerNonFlowerTile } from "common/deck";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import Kong from "model/meld/kong";
import { meldIsKong } from "model/meld/kong";
import { createMeldsExistPredicateIgnoreExposed, createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";

// Checks that kongs exist in the winning hand for each single tile in tiles
export function createKongsExistPredicate(pointPredicateID : string, tiles: SuitedOrHonorTile[], numKongsToMatch?: number) : PointPredicate<MeldBasedWinningHand> {
    const tileQuantityMap = new TileToQuantityMap(tiles);
    for (const tile of tiles) {
        if (tileQuantityMap.getQuantity(tile) * 4 > maxQuantityPerNonFlowerTile) {
            throw new Error(`Cannot create a predicate of more than 1 kong for the same tile: ${tile.group} ${tile.value}.`)
        }
    }
    const kongsToMatch : Kong[] = [];
    for (const tile of tiles) {
        kongsToMatch.push(new Kong(tile));
    }

    if (numKongsToMatch && (numKongsToMatch > tiles.length || numKongsToMatch < 0)) {
        throw new Error(`numKongsToMatch must be between 0 and tiles.length (${tiles.length})`);
    }
    return createMeldsExistPredicateIgnoreExposed(pointPredicateID, kongsToMatch, numKongsToMatch ?? kongsToMatch.length);
}

export function createKongQuantityPredicate(pointPredicateID : string, minNumKongs?: number, maxNumKongs: number | undefined = minNumKongs) : PointPredicate<MeldBasedWinningHand> {
    return createMeldCheckerSuccessesQuantityPredicate(pointPredicateID, meldIsKong, minNumKongs, maxNumKongs);
}