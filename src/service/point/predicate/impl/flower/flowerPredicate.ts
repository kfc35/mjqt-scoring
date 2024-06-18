import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { createPointPredicateResultBasedOnBooleanFlag } from "service/point/predicate/impl/util/pointPredicateUtil";
import { FlowerTile } from "model/tile/group/flowerTile";
import { GENTLEMEN_TILES, SEASON_TILES } from "common/deck";

export const SEAT_GENTLEMAN_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, _winContext: WinContext, roundContext: RoundContext) => {
        const gentlemanTileToFind = roundContext.getSeatWindAsGentlemanTile();
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.SEAT_GENTLEMAN, 
            filterFlowerTiles(winningHand.flowerTiles, [gentlemanTileToFind]).length > 0, [[gentlemanTileToFind]]);
    }

export const SEAT_SEASON_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, _winContext: WinContext, roundContext: RoundContext) => {
        const seasonTileToFind = roundContext.getSeatWindAsSeasonTile();
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.SEAT_SEASON, 
            filterFlowerTiles(winningHand.flowerTiles, [seasonTileToFind]).length > 0, [[seasonTileToFind]]);
    }

export const PREVAILING_GENTLEMAN_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, _winContext: WinContext, roundContext: RoundContext) => {
        const gentlemanTileToFind = roundContext.getPrevailingWindAsGentlemanTile();
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.PREVAILING_GENTLEMAN, 
            filterFlowerTiles(winningHand.flowerTiles, [gentlemanTileToFind]).length > 0, [[gentlemanTileToFind]]);
    }

export const PREVAILING_SEASON_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, _winContext: WinContext, roundContext: RoundContext) => {
        const seasonTileToFind = roundContext.getPrevailingWindAsSeasonTile();
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.PREVAILING_SEASON, 
            filterFlowerTiles(winningHand.flowerTiles, [seasonTileToFind]).length > 0, [[seasonTileToFind]]);
    }

export const ANY_GENTLEMAN_OR_SEASON_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        const gentlemenAndSeasons = filterFlowerTiles(winningHand.flowerTiles, [...GENTLEMEN_TILES, ...SEASON_TILES]);
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.ANY_GENTLEMAN_OR_SEASON, 
            gentlemenAndSeasons.length > 0, [gentlemenAndSeasons]);
    }

export const ALL_GENTLEMEN_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        const gentlemen = filterFlowerTiles(winningHand.flowerTiles, GENTLEMEN_TILES);
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.ALL_GENTLEMEN, 
            gentlemen.length === GENTLEMEN_TILES.length, [gentlemen]);
    }

export const ALL_SEASONS_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        const seasons = filterFlowerTiles(winningHand.flowerTiles, SEASON_TILES);
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.ALL_SEASONS, 
            seasons.length === SEASON_TILES.length, [seasons]);
    }

export const ALL_GENTLEMEN_AND_SEASONS_PREDICATE : PointPredicate<WinningHand> = 
    predicateAnd(PointPredicateID.ALL_GENTLEMAN_AND_SEASONS, ALL_GENTLEMEN_PREDICATE, ALL_SEASONS_PREDICATE);

export const NO_GENTLEMEN_OR_SEASONS_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        const gentlemenAndSeasons = filterFlowerTiles(winningHand.flowerTiles, [...GENTLEMEN_TILES, ...SEASON_TILES]);
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.NO_GENTLEMEN_OR_SEASONS, 
            gentlemenAndSeasons.length === 0, [winningHand.flowerTiles]);
    }

function filterFlowerTiles(flowerTiles: FlowerTile[], tilesToKeep: FlowerTile[]): FlowerTile[] {
    return flowerTiles.filter(flowerTile => tilesToKeep.filter(tileToKeep => tileToKeep.equals(flowerTile)).length > 0);
}