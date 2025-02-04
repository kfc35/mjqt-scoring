import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { MeldType } from "model/meld/meldType";
import { assertTilesSuitedOrHonor } from "common/tileUtils";

export default abstract class Meld {
    protected _tiles: [SuitedOrHonorTile, SuitedOrHonorTile, ...SuitedOrHonorTile[]];
    protected _type: MeldType;
    /*  _exposed = false if the meld was completed without the need of a discard.
        _exposed = true if a discard was used to complete the meld. 
          Pairs can have _exposed = true (the pair was completed via discard to complete the hand) */
    protected _exposed: boolean;

    /** implementing classes should ensure that tiles are ordered in their desired way for comparisons (applies to chows) */
    constructor(sortedTiles: [SuitedOrHonorTile, SuitedOrHonorTile, ...SuitedOrHonorTile[]], type: MeldType, exposed: boolean = false) {
        assertTilesSuitedOrHonor(sortedTiles);
        this._tiles = sortedTiles;
        this._type = type;
        this._exposed = exposed;
    }

    get tiles(): [SuitedOrHonorTile, SuitedOrHonorTile, ...SuitedOrHonorTile[]] {
        return this._tiles;
    }

    // for non knitted chows, the group of this tile is the TileGroup for the whole meld.
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