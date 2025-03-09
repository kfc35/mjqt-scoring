import { type SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { MeldType } from "model/meld/meldType";
import { assertTilesSuitedOrHonor } from "common/tileUtils";
import type { SuitedTile } from "model/tile/group/suitedTile";
import type { HonorTile } from "model/tile/group/honorTile";

export abstract class Meld {
    protected _tiles: [SuitedTile, SuitedTile, ...SuitedTile[]] | [HonorTile, HonorTile, ...HonorTile[]];
    protected _type: MeldType;
    /*  _exposed = false if the meld was completed without the need of a discard.
        _exposed = true if a discard was used to complete the meld. 
          Pairs can have _exposed = true (the pair was completed via discard to complete the hand) */
    protected _exposed: boolean;

    /** implementing classes should ensure that tiles are ordered in their desired way for comparisons (applies to chows) */
    constructor(sortedTiles: [SuitedTile, SuitedTile, ...SuitedTile[]] | [HonorTile, HonorTile, ...HonorTile[]], 
        type: MeldType, exposed: boolean = false) {
        assertTilesSuitedOrHonor(sortedTiles);
        this._tiles = sortedTiles;
        this._type = type;
        this._exposed = exposed;
    }

    get tiles(): [SuitedTile, SuitedTile, ...SuitedTile[]] | [HonorTile, HonorTile, ...HonorTile[]] {
        return this._tiles;
    }

    // except for non knitted chows, the group of this tile is the TileGroup for the whole meld.
    getFirstTile(): SuitedOrHonorTile {
        return this._tiles[0];
    }

    get type(): MeldType {
        return this._type;
    }

    get exposed(): boolean {
        return this._exposed;
    }

    equalsIgnoreExposed(meld: Meld | undefined) {
        return this.equals(meld, true);
    }

    // ignoreExposed default is true
    equals(meld: Meld | undefined, ignoreExposed? : boolean): boolean {
        if (!meld) {
            return false;
        }
        if (this._tiles.length !== meld.tiles.length) {
            return false;
        }
        if (this._type !== meld.type) {
            return false;
        }
        if (!this._tiles.every((tile, index) => tile.equals(meld.tiles[index]))) {
            return false;
        }
        return ((ignoreExposed ?? true) || this._exposed === meld.exposed);
    }

    abstract clone(exposedOverride? : boolean): Meld;

    // for sorting
    compareTo(otherMeld : Meld) : number {
        return this._tiles[0].compareTo(otherMeld._tiles[0]);
    }
}