import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { MeldType } from "model/meld/meldType";
import { assertTilesSuitedOrHonor } from "common/tileUtils";
import { TileGroup } from "model/tile/tileGroup";

export default abstract class Meld {
    protected _tiles: [SuitedOrHonorTile, SuitedOrHonorTile, ...SuitedOrHonorTile[]];
    protected _type: MeldType;
    /*  _exposed = false if the meld was completed without the need of a discard.
        _exposed = true if a discard was used to complete it during regular play.
        If the last tile that completes your hand AND this meld is from a discard, 
        _exposed is set to true. */
    protected _exposed: boolean;

    constructor(tiles: [SuitedOrHonorTile, SuitedOrHonorTile, ...SuitedOrHonorTile[]], type: MeldType, exposed: boolean = false) {
        assertTilesSuitedOrHonor(tiles);
        const tilesCopy : [SuitedOrHonorTile, SuitedOrHonorTile, ...SuitedOrHonorTile[]] = [...tiles];
        this._tiles = tilesCopy.sort(function(tile1: SuitedOrHonorTile, tile2: SuitedOrHonorTile){
            return tile1.compareTo(tile2);
        });
        this._type = type;
        this._exposed = exposed;
    }

    get tiles(): [SuitedOrHonorTile, SuitedOrHonorTile, ...SuitedOrHonorTile[]] {
        return this._tiles;
    }

    // for non knitted chows, this will always be the tile group of the *whole* meld
    getTileGroupOfFirstTile(): TileGroup {
        return this._tiles[0].group;
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
        // TODO this assumption is not necessarily true... tiles is sorted in both meld objects.
        if (!this._tiles.every((tile, index) => tile.equals(meld.tiles[index]))) {
            return false;
        }
        return this._type === meld.type && ((ignoreExposed ?? true) || this._exposed === meld.exposed);
    }

    // TODO meld ordering for lists to increase readability
    // default sort by suit, then number ascending.
    // can customize sort by exposed.

    abstract clone(exposedOverride? : boolean): Meld;

    // for sorting
    compareTo(otherMeld : Meld) : number {
        return this._tiles[0].compareTo(otherMeld._tiles[0]);
    }
}