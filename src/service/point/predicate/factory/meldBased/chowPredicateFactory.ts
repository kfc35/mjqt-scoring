import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import Chow, { meldIsChow } from "model/meld/chow";
import SuitedTile from "model/tile/group/suitedTile";
import { getNextSuitedTileValue } from "model/tile/tileValue";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { assertTilesHaveSameSuitedGroup } from "common/tileUtils";
import { createMeldsExistPredicateIgnoreExposed, createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";

// Checks that all the given tile sequences exist as chows in a winning hand.
// You can use this function for knitted tiles
export function createChowsExistPredicateFromSequences(pointPredicateID : string, tileSequences: [SuitedTile, SuitedTile, SuitedTile][], numSequencesToMatch?: number) : PointPredicate<MeldBasedWinningHand> {
    const chows : Chow[] = [];
    for (const sequence of tileSequences) {
        if (sequence[0].group !== sequence[1].group 
            && sequence[1].group !== sequence[2].group
            && sequence[0].group !== sequence[2].group) {
            chows.push(new Chow(sequence, false));
        } else {
            assertTilesHaveSameSuitedGroup(sequence);   
            chows.push(new Chow(sequence));
        }
    }
    if (numSequencesToMatch && (numSequencesToMatch > tileSequences.length || numSequencesToMatch < 0)) {
        throw new Error(`numSequencesToMatch must be between 0 and tileSequences.length (${tileSequences.length})`);
    }
    return createMeldsExistPredicateIgnoreExposed(pointPredicateID, chows, numSequencesToMatch ?? chows.length);
}

// Creates same suited tile sequences using the provided tiles as the lowest in a consecutive, non-knitted sequence, then checks for those sequences in the winning hand.
export function createChowsExistPredicateFromTiles(pointPredicateID : string, tiles: SuitedTile[], numSequencesToMatch? : number) : PointPredicate<MeldBasedWinningHand> {
    const chows : Chow[] = [];
    for (const tile of tiles) {
        const nextTileValue = getNextSuitedTileValue(tile.value);
        if (!nextTileValue) {
            throw new Error("Invalid tile provided. Tile value must be earliest tile in the sequence (<=7)");
        }
        const twoAfterTileValue = getNextSuitedTileValue(nextTileValue);
        if (!twoAfterTileValue) {
            throw new Error("Invalid tile provided. Tile value must be earliest tile in the sequence (<=7)");
        }
        const nextTile = constructSuitedTile(tile.group, nextTileValue);
        const twoAfterTile = constructSuitedTile(tile.group, twoAfterTileValue);
        const sequence: [SuitedTile, SuitedTile, SuitedTile] = 
            [tile, nextTile, twoAfterTile]
        chows.push(new Chow(sequence));
    }
    if (numSequencesToMatch && (numSequencesToMatch > tiles.length || numSequencesToMatch < 0)) {
        throw new Error(`numSequencesToMatch must be between 0 and tiles.length (${tiles.length})`);
    }
    return createMeldsExistPredicateIgnoreExposed(pointPredicateID, chows, numSequencesToMatch ?? chows.length);
}

export function createChowQuantityPredicate(pointPredicateID : string, minNumChows?: number, maxNumChows: number | undefined = minNumChows) : PointPredicate<MeldBasedWinningHand> {
    return createMeldCheckerSuccessesQuantityPredicate(pointPredicateID, meldIsChow, minNumChows, maxNumChows);
}