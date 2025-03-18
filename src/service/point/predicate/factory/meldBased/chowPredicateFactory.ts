import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { Chow } from "model/meld/chow";
import { SuitedTile } from "model/tile/group/suitedTile";
import { getNextSuitedTileValue } from "model/tile/tileValue";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { assertTilesHaveSameSuitedGroup } from "common/tileUtils";
import { createMeldsExistPredicateIgnoreExposed } from "service/point/predicate/factory/meldBased/meldPredicateFactoryBase";

// Checks that all some of the given tile sequences exist as chows in a winning hand.
export function createChowsExistPredicateFromSequences(pointPredicateID : string, 
    tileSequences: [SuitedTile, SuitedTile, SuitedTile][], minNumChowsToMatch?: number, maxNumChowsToMatch?: number) : PointPredicate<MeldBasedWinningHand> {
    if (!!minNumChowsToMatch && (minNumChowsToMatch < 0 || minNumChowsToMatch > tileSequences.length)) {
        throw new Error(`minNumChowsToMatch, if defined, must be between 0 and tileSequences.length (${tileSequences.length})`);
    }
    if (!!maxNumChowsToMatch && (maxNumChowsToMatch < 0 || maxNumChowsToMatch > tileSequences.length)) {
        throw new Error(`maxNumChowsToMatch, if defined, must be between 0 and tileSequences.length (${tileSequences.length})`);
    }
    if (!!minNumChowsToMatch && !!maxNumChowsToMatch && minNumChowsToMatch > maxNumChowsToMatch) {
        throw new Error(`minNumChowsToMatch must be < maxNumChowsToMatch`);
    }
    
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
    
    return createMeldsExistPredicateIgnoreExposed(pointPredicateID, chows, minNumChowsToMatch, maxNumChowsToMatch);
}

// Creates same suited tile sequences using the provided tiles as the lowest in a consecutive, non-knitted sequence, then checks for those sequences in the winning hand.
export function createChowsExistPredicateFromTiles(pointPredicateID : string, tiles: SuitedTile[], minNumChowsToMatch? : number, maxNumChowsToMatch? : number) : PointPredicate<MeldBasedWinningHand> {
    if (!!minNumChowsToMatch && (minNumChowsToMatch > tiles.length || minNumChowsToMatch < 0)) {
        throw new Error(`minNumChowsToMatch, if defined, must be between 0 and tiles.length (${tiles.length})`);
    }
    if (!!maxNumChowsToMatch && (maxNumChowsToMatch > tiles.length)) {
        throw new Error(`maxNumChowsToMatch must be between minNumPairsToMatch and tiles.length (${tiles.length})`);
    }
    if (!!minNumChowsToMatch && !!maxNumChowsToMatch && (minNumChowsToMatch > maxNumChowsToMatch)) {
        throw new Error(`minNumChowsToMatch must be < maxNumChowsToMatch`);
    }

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

    return createMeldsExistPredicateIgnoreExposed(pointPredicateID, chows, minNumChowsToMatch, maxNumChowsToMatch);
}