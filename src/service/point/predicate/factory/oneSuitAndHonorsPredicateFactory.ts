import { PointPredicate } from "service/point/predicate/pointPredicate";
import { StandardWinningHand } from "model/hand/hk/winningHand/standardWinningHand";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue, suitedTileValues, TileValue } from "model/tile/tileValue";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { suitedTileGroups } from "model/tile/group/suitedTile";
import { honorTileGroups } from "model/tile/group/honorTile";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { Tile } from "model/tile/tile";

export function createNumSuitedTileGroupsPredicate(pointPredicateID: string, desiredNumSuitedTileGroups: number) : PointPredicate<StandardWinningHand> {
    return (winningHand: StandardWinningHand) => {
        const tileGroupsToTiles = createTileGroupsToTilesMap(winningHand);
        let numSuitedTileGroups = 0;
        const suitedTiles : Tile[][] = [];
        suitedTileGroups.forEach((group) => {
            const tiles = tileGroupsToTiles.get(group);
            if (tiles) { 
                numSuitedTileGroups++; 
                suitedTiles.push(tiles);
            }
        });
        if (numSuitedTileGroups !== desiredNumSuitedTileGroups) {
            // have to put offending tiles.
            return new PointPredicateResult(pointPredicateID, false, suitedTiles, []);
        }
        // put the suited tiles here.
        return new PointPredicateResult(pointPredicateID, true, suitedTiles, []);
    }
}

export function createNumSuitedTileGroupsPredicateSpecial(pointPredicateID: string, desiredNumSuitedTileGroups: number) : PointPredicate<SpecialWinningHand> {
    return (winningHand: SpecialWinningHand) => {
        const tileGroupsToTiles = createTileGroupsToTilesMapSpecial(winningHand);
        let numSuitedTileGroups = 0;
        const suitedTiles : Tile[][] = [];
        suitedTileGroups.forEach((group) => {
            const tiles = tileGroupsToTiles.get(group);
            if (tiles) { 
                numSuitedTileGroups++; 
                suitedTiles.push(tiles);
            }
        });
        if (numSuitedTileGroups !== desiredNumSuitedTileGroups) {
            // have to put offending tiles.
            return new PointPredicateResult(pointPredicateID, false, suitedTiles, []);
        }
        // put the suited tiles here.
        return new PointPredicateResult(pointPredicateID, true, suitedTiles, []);
    }
}

export function createSuitedTileValuePredicate(pointPredicateID: string, desiredSuitedTileValues: SuitedTileValue[]) : PointPredicate<StandardWinningHand> {
    return (winningHand: StandardWinningHand) => {
        const tileValuesToTiles = createTileValuesToTilesMap(winningHand);
        const undesiredSuitedTileValues = suitedTileValues.filter(tileValue => desiredSuitedTileValues.indexOf(tileValue) === -1);
        const desiredSuitedTiles : Tile[][] = [];
        const undesiredSuitedTiles : Tile[][] = [];
        for (const undesiredSuitedTileValue of undesiredSuitedTileValues) {
            const badTiles = tileValuesToTiles.get(undesiredSuitedTileValue);
            if (badTiles) {
                undesiredSuitedTiles.push(badTiles);
            }
        }
        if (undesiredSuitedTiles.length !== 0) {
            return new PointPredicateResult(pointPredicateID, false, undesiredSuitedTiles, []);
        }

        for (const desiredSuitedTileValue of desiredSuitedTileValues) {
            const okTiles = tileValuesToTiles.get(desiredSuitedTileValue);
            if (okTiles) {
                desiredSuitedTiles.push(okTiles);
            }
        }
        return new PointPredicateResult(pointPredicateID, true, desiredSuitedTiles, []);
    }
}

export function createNumHonorTileGroupsPredicate(pointPredicateID: string, desiredNumHonorTileGroups: number) : PointPredicate<StandardWinningHand> {
    return (winningHand: StandardWinningHand) => {
        const tileGroupsToTiles = createTileGroupsToTilesMap(winningHand);
        let numHonorTileGroups = 0;
        honorTileGroups.forEach((group) => {if (tileGroupsToTiles.has(group)) { numHonorTileGroups++ }});
        if (numHonorTileGroups !== desiredNumHonorTileGroups) {
            // have to put offending tiles.
            return new PointPredicateResult(pointPredicateID, false, [], []);
        }
        // put the honor tiles here.
        return new PointPredicateResult(pointPredicateID, true, winningHand.getContents(), []);
    }
}

function createTileGroupsToTilesMap(winningHand : StandardWinningHand) : ReadonlyMap<TileGroup, SuitedOrHonorTile[]> {
    const map = new Map<TileGroup, SuitedOrHonorTile[]>();
    winningHand.getContents().forEach(meld => {
        meld.tiles.forEach(tile => {
            const tilesEntry = map.get(tile.group);
            if (tilesEntry) {
                tilesEntry.push(tile);
            } else {
                map.set(tile.group, [tile]);
            }
        });
    });
    return map;
}

function createTileGroupsToTilesMapSpecial(winningHand : SpecialWinningHand) : ReadonlyMap<TileGroup, SuitedOrHonorTile[]> {
    const map = new Map<TileGroup, SuitedOrHonorTile[]>();
    winningHand.getContents().forEach(tiles => {
        tiles.forEach(tile => {
            const tilesEntry = map.get(tile.group);
            if (tilesEntry) {
                tilesEntry.push(tile);
            } else {
                map.set(tile.group, [tile]);
            }
        });
    });
    return map;
}

function createTileValuesToTilesMap(winningHand : StandardWinningHand) : ReadonlyMap<TileValue, SuitedOrHonorTile[]> {
    const map = new Map<TileValue, SuitedOrHonorTile[]>();
    winningHand.getContents().forEach(meld => {
        meld.tiles.forEach(tile => {
            const tilesEntry = map.get(tile.value);
            if (tilesEntry) {
                tilesEntry.push(tile);
            } else {
                map.set(tile.value, [tile]);
            }
        });
    });
    return map;
}

function createTileValuesToTilesMapSpecial(winningHand : SpecialWinningHand) : ReadonlyMap<TileValue, SuitedOrHonorTile[]> {
    const map = new Map<TileValue, SuitedOrHonorTile[]>();
    winningHand.getContents().forEach(tiles => {
        tiles.forEach(tile => {
            const tilesEntry = map.get(tile.value);
            if (tilesEntry) {
                tilesEntry.push(tile);
            } else {
                map.set(tile.value, [tile]);
            }
        });
    });
    return map;
}