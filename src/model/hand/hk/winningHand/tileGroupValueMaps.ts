import { type HonorTile, type HonorTileGroup, type HonorTileValue, isHonorTile } from "model/tile/group/honorTile";
import SuitedTile, { type SuitedTileGroup, isSuitedTile, isSuitedTileGroup } from "model/tile/group/suitedTile";
import { SuitedOrHonorTileValue, type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { isSuitedTileValue, SuitedTileValue } from "model/tile/tileValue";
import Meld from "model/meld/meld";
import { addToMapValueSet, pushToMapValueArray } from "common/generic/mapUtils";
import { meldIsChow } from "model/meld/chow";
import { toFlatTiles, getMeldsSubsetFromIndicesSet } from "common/meldUtils";

export interface TileGroupValueMaps {
    getSuitedTileGroups(): Set<SuitedTileGroup>;
    getSuitedTileValues(): Set<SuitedTileValue>;
    getHonorTileGroups(): Set<HonorTileGroup>;
    getHonorTileValues(): Set<HonorTileValue>;
    getTilesForTileGroups(tileGroups: ReadonlySet<SuitedTileGroup | HonorTileGroup>): SuitedOrHonorTile[][];
    getTilesForTileValues(tileValues: ReadonlySet<SuitedOrHonorTileValue>): SuitedOrHonorTile[][]
}

export class StandardWinningHandTileGroupValueMaps implements TileGroupValueMaps {
    private _melds: readonly Meld[];
    private _knittedChowIndices: Set<number>;
    private _suitedTileGroupToKnittedChowTiles: Map<SuitedTileGroup, SuitedTile[]>;
    private _suitedTileGroupToNonKnittedMeldIndices: Map<SuitedTileGroup, Set<number>>;
    private _suitedTileValueToMeldIndices: Map<SuitedTileValue, Set<number>>;
    private _suitedTileValueToTiles: Map<SuitedTileValue, SuitedTile[]>;
    private _honorTileGroupToMeldIndices: Map<HonorTileGroup, Set<number>>;
    private _honorTileValueToMeldIndices: Map<HonorTileValue, Set<number>>;

    constructor(melds: readonly Meld[]) {
        this._melds = melds;
        this._knittedChowIndices = new Set();
        this._suitedTileGroupToKnittedChowTiles = new Map();
        this._suitedTileGroupToNonKnittedMeldIndices = new Map();
        this._suitedTileValueToMeldIndices = new Map();
        this._suitedTileValueToTiles = new Map();
        this._honorTileGroupToMeldIndices = new Map();
        this._honorTileValueToMeldIndices = new Map();
        this._melds.forEach((meld, index) => {
            const firstTile = meld.getFirstTile();
            if (isSuitedTile(firstTile)) {
                if (meldIsChow(meld) && meld.isKnitted()) {
                    this._knittedChowIndices.add(index);
                    meld.tiles.forEach(tile => pushToMapValueArray(this._suitedTileGroupToKnittedChowTiles, tile.group, tile));
                } else {
                    // the firstTileGroup is the tileGroup for the whole non-knitted meld.
                    addToMapValueSet(this._suitedTileGroupToNonKnittedMeldIndices, firstTile.group, index);
                }

                meld.tiles.forEach(tile => {
                    if (isSuitedTile(tile)) { // guaranteed to be true but just in case, 
                        addToMapValueSet(this._suitedTileValueToMeldIndices, tile.value, index);
                        pushToMapValueArray(this._suitedTileValueToTiles, tile.value, tile);
                    } else {
                        throw new Error(`Found a non suited tile ${tile.group} ${tile.value} in what should be a suited meld (first tile ${firstTile.group} ${firstTile.value})`);
                    }
                });
            }
            if (isHonorTile(firstTile)) {
                addToMapValueSet(this._honorTileGroupToMeldIndices, firstTile.group, index);
                addToMapValueSet(this._honorTileValueToMeldIndices, firstTile.value, index);
            }
        });
    }

    getKnittedChowIndices(): Set<number> {
        return this._knittedChowIndices;
    }

    getSuitedTileGroups(): Set<SuitedTileGroup> {
        const suitedTileGroups = new Set(this._suitedTileGroupToKnittedChowTiles.keys());
        for (const suitedTileGroup of this._suitedTileGroupToNonKnittedMeldIndices.keys()) {
            suitedTileGroups.add(suitedTileGroup);
        }
        return suitedTileGroups;
    }

    getTilesFromKnittedChows(suitedTileGroup: SuitedTileGroup): SuitedTile[] {
        return this._suitedTileGroupToKnittedChowTiles.get(suitedTileGroup) ?? [];
    }

    getMeldIndicesForSuitedTileGroup(suitedTileGroup: SuitedTileGroup): Set<number> {
        return this._suitedTileGroupToNonKnittedMeldIndices.get(suitedTileGroup) ?? new Set();
    }

    getTilesForSuitedTileValue(suitedTileValue: SuitedTileValue): SuitedTile[] {
        return this._suitedTileValueToTiles.get(suitedTileValue) ?? [];
    }

    getMeldIndicesForSuitedTileValue(suitedTileValue: SuitedTileValue): Set<number> {
        return this._suitedTileValueToMeldIndices.get(suitedTileValue) ?? new Set();
    }

    getSuitedTileValues(): Set<SuitedTileValue> {
        return new Set(this._suitedTileValueToMeldIndices.keys());
    }
    
    getHonorTileGroups() : Set<HonorTileGroup> {
        return new Set(this._honorTileGroupToMeldIndices.keys());
    }

    getHonorTileValues(): Set<HonorTileValue> {
        return new Set(this._honorTileValueToMeldIndices.keys());
    }

    getMeldIndicesForHonorTileGroup(honorTileGroup: HonorTileGroup): Set<number> {
        return this._honorTileGroupToMeldIndices.get(honorTileGroup) ?? new Set();
    }

    getMeldIndicesForHonorTileValue(honorTileValue: HonorTileValue): Set<number> {
        return this._honorTileValueToMeldIndices.get(honorTileValue) ?? new Set();
    }

    getTilesForTileGroups(tileGroups: ReadonlySet<SuitedTileGroup | HonorTileGroup>): SuitedOrHonorTile[][] {
        return [...tileGroups.values()].map(tileGroup => {
            if (isSuitedTileGroup(tileGroup)) {
                const tiles = this.getTilesFromKnittedChows(tileGroup);
                const meldTiles = toFlatTiles(getMeldsSubsetFromIndicesSet(this._melds, this.getMeldIndicesForSuitedTileGroup(tileGroup)));
                return [...tiles, ...meldTiles];
            } 
            return toFlatTiles(getMeldsSubsetFromIndicesSet(this._melds, this.getMeldIndicesForHonorTileGroup(tileGroup)));
        });
    }

    getTilesForTileValues(tileValues: ReadonlySet<SuitedOrHonorTileValue>): SuitedOrHonorTile[][] {
        return [...tileValues.values()].map(tileValue => {
            if (isSuitedTileValue(tileValue)) {
                return this.getTilesForSuitedTileValue(tileValue);
            } 
            return toFlatTiles(getMeldsSubsetFromIndicesSet(this._melds, this.getMeldIndicesForHonorTileValue(tileValue)));
        });
    }
}

export class SpecialWinningHandTileGroupValueMaps implements TileGroupValueMaps {
    private _tiles: readonly SuitedOrHonorTile[][];
    private _suitedTileGroupToTiles: Map<SuitedTileGroup, SuitedTile[]>;
    private _suitedTileValueToTiles: Map<SuitedTileValue, SuitedTile[]>;
    private _honorTileGroupToTiles: Map<HonorTileGroup, HonorTile[]>;
    private _honorTileValueToTiles: Map<HonorTileValue, HonorTile[]>;

    constructor(tiles: readonly SuitedOrHonorTile[][]) {
        this._tiles = tiles;
        this._suitedTileGroupToTiles = new Map();
        this._suitedTileValueToTiles = new Map();
        this._honorTileGroupToTiles = new Map();
        this._honorTileValueToTiles = new Map();
        this._tiles.forEach((tilesSubset) => {
            tilesSubset.forEach(tile => {
                if (isSuitedTile(tile)) {
                    pushToMapValueArray(this._suitedTileGroupToTiles, tile.group, tile);
                    pushToMapValueArray(this._suitedTileValueToTiles, tile.value, tile);
                }

                if (isHonorTile(tile)) {
                    pushToMapValueArray(this._honorTileGroupToTiles, tile.group, tile);
                    pushToMapValueArray(this._honorTileValueToTiles, tile.value, tile);
                }
            });
        });
    }

    getSuitedTileGroups(): Set<SuitedTileGroup> {
        return new Set(this._suitedTileGroupToTiles.keys());
    }

    getTilesForSuitedTileGroup(suitedTileGroup: SuitedTileGroup): SuitedTile[] {
        return this._suitedTileGroupToTiles.get(suitedTileGroup) ?? [];
    }

    getSuitedTileValues(): Set<SuitedTileValue> {
        return new Set(this._suitedTileValueToTiles.keys());
    }

    getTilesForSuitedTileValue(suitedTileValue: SuitedTileValue): SuitedTile[] {
        return this._suitedTileValueToTiles.get(suitedTileValue) ?? [];
    }
    
    getHonorTileGroups() : Set<HonorTileGroup> {
        return new Set(this._honorTileGroupToTiles.keys());
    }

    getTilesForHonorTileGroup(honorTileGroup: HonorTileGroup): HonorTile[] {
        return this._honorTileGroupToTiles.get(honorTileGroup) ?? [];
    }

    getHonorTileValues(): Set<HonorTileValue> {
        return new Set(this._honorTileValueToTiles.keys());
    }

    getTilesForHonorTileValue(honorTileValue: HonorTileValue): HonorTile[] {
        return this._honorTileValueToTiles.get(honorTileValue) ?? [];
    }
    
    getTilesForTileGroups(tileGroups: Set<SuitedTileGroup | HonorTileGroup>): SuitedOrHonorTile[][] {
        return [...tileGroups.values()].map(tileGroup => {
            if (isSuitedTileGroup(tileGroup)) {
                return this.getTilesForSuitedTileGroup(tileGroup);
            } 
            return this.getTilesForHonorTileGroup(tileGroup);
        });
    }

    getTilesForTileValues(tileValues: Set<SuitedOrHonorTileValue>): SuitedOrHonorTile[][] {
        return [...tileValues.values()].map(tileValue => {
            if (isSuitedTileValue(tileValue)) {
                return this.getTilesForSuitedTileValue(tileValue);
            } 
            return this.getTilesForHonorTileValue(tileValue);
        });
    }
}