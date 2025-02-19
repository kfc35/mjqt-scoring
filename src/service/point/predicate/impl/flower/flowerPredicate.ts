import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import WinContext from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { createPPResultBasedOnBooleanFlagWithTileDetail } from "service/point/predicate/impl/util/pointPredicateUtil";
import { FlowerTile } from "model/tile/group/flowerTile";
import { FLOWER_TILES, GENTLEMEN_TILES, SEASON_TILES } from "common/deck";
import { tilesDoesNotContainTile } from "common/tileUtils";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";

export const SEAT_GENTLEMAN_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, _winCtx: WinContext, roundCtx: RoundContext) => {
        const gentlemanTileToFind = roundCtx.getSeatWindAsGentlemanTile();
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SEAT_GENTLEMAN, 
            filterFlowerTiles(winningHand.flowerTiles, [gentlemanTileToFind]).length > 0, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[gentlemanTileToFind]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatAreMissingToSatisfyPredicate([[gentlemanTileToFind]]).build());
    }

export const SEAT_SEASON_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, _winCtx: WinContext, roundCtx: RoundContext) => {
        const seasonTileToFind = roundCtx.getSeatWindAsSeasonTile();
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SEAT_SEASON, 
            filterFlowerTiles(winningHand.flowerTiles, [seasonTileToFind]).length > 0, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[seasonTileToFind]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatAreMissingToSatisfyPredicate([[seasonTileToFind]]).build());
    }

export const PREVAILING_GENTLEMAN_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, _winCtx: WinContext, roundCtx: RoundContext) => {
        const gentlemanTileToFind = roundCtx.getPrevailingWindAsGentlemanTile();
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.PREVAILING_GENTLEMAN, 
            filterFlowerTiles(winningHand.flowerTiles, [gentlemanTileToFind]).length > 0, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[gentlemanTileToFind]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatAreMissingToSatisfyPredicate([[gentlemanTileToFind]]).build());
    }

export const PREVAILING_SEASON_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand, _winContext: WinContext, roundCtx: RoundContext) => {
        const seasonTileToFind = roundCtx.getPrevailingWindAsSeasonTile();
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.PREVAILING_SEASON, 
            filterFlowerTiles(winningHand.flowerTiles, [seasonTileToFind]).length > 0, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[seasonTileToFind]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatAreMissingToSatisfyPredicate([[seasonTileToFind]]).build());
    }

export const ANY_GENTLEMAN_OR_SEASON_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        const gentlemenAndSeasons = filterFlowerTiles(winningHand.flowerTiles, [...GENTLEMEN_TILES, ...SEASON_TILES]);
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.ANY_GENTLEMAN_OR_SEASON, 
            gentlemenAndSeasons.length > 0, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([gentlemenAndSeasons]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatAreMissingToSatisfyPredicate([FLOWER_TILES]).build());
    }

export const ALL_GENTLEMEN_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        const gentlemen = filterFlowerTiles(winningHand.flowerTiles, GENTLEMEN_TILES);
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.ALL_GENTLEMEN, 
            gentlemen.length === GENTLEMEN_TILES.length, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([gentlemen]).build(),
            new PointPredicateFailureResultTileDetail.Builder().tilesThatAreMissingToSatisfyPredicate(
                [GENTLEMEN_TILES.filter(tile => tilesDoesNotContainTile(gentlemen, tile))]).build());
    }

export const ALL_SEASONS_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        const seasons = filterFlowerTiles(winningHand.flowerTiles, SEASON_TILES);
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.ALL_SEASONS, 
            seasons.length === SEASON_TILES.length, 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([seasons]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatAreMissingToSatisfyPredicate(
                [SEASON_TILES.filter(tile => tilesDoesNotContainTile(seasons, tile))]).build());
    }

export const ALL_GENTLEMEN_AND_SEASONS_PREDICATE : PointPredicate<WinningHand> = 
    predicateAnd(PointPredicateID.ALL_GENTLEMAN_AND_SEASONS, ALL_GENTLEMEN_PREDICATE, ALL_SEASONS_PREDICATE);

export const NO_GENTLEMEN_OR_SEASONS_PREDICATE : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        const gentlemenAndSeasons = filterFlowerTiles(winningHand.flowerTiles, [...GENTLEMEN_TILES, ...SEASON_TILES]);
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.NO_GENTLEMEN_OR_SEASONS, 
            gentlemenAndSeasons.length === 0, 
            new PointPredicateSuccessResultTileDetail.Builder().build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([gentlemenAndSeasons]).build());
    }

function filterFlowerTiles(flowerTiles: FlowerTile[], tilesToKeep: FlowerTile[]): FlowerTile[] {
    return flowerTiles.filter(flowerTile => tilesToKeep.filter(tileToKeep => tileToKeep.equals(flowerTile)).length > 0);
}