import { assertTilesHongKongTile, assertTilesNotNullAndCorrectLength, tilesUnique, assertEachTileHasQuantityLTEMaxPerTile } from "common/tileUtils";
import { Tile } from "model/tile/tile";
import { type HongKongTile } from "model/tile/hk/hongKongTile";
import { type FlowerTile, isFlowerTile } from "model/tile/group/flowerTile";
import { type SuitedOrHonorTile, isSuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { handMinLengthWithoutFlowers, handMaxLength, handMaxNumUniqueFlowers, handMaxLengthWithoutFlowers } from "model/hand/hk/handConstants";
import { TileGroup } from "model/tile/tileGroup";
import { type TileValue } from "model/tile/tileValue";
import Meld from "model/meld/meld";
import { meldExistsInMelds, toFlatTiles } from "common/meldUtils";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";

/** A Hand is an unsorted collection of Mahjong Tiles.
 * It represents an instance when it is the player's turn.
 * It may or may not represent a winning hand based on what the tiles are. */
export class Hand {
    private _tileToQuantity: TileToQuantityMap;
    private _mostRecentTileContext : MostRecentTileContext;
    /* userSpecifiedMelds are melds that must be present in every derived winning hand.
       Exposed melds must exist exactly as they are specified.
       Unexposed melds could become exposed as a result of the MostRecentTileContext. You can specify this behavior via lockConcealedSpecifiedMelds
       userSpecifiedMelds = [] means that there are no restrictions on any derived winning hands.
       If a userSpecifiedMeld is defined in mostRecentTileContext, it must also be present in userSpecifiedMelds.
       The tiles in each meld must also be present in _tileToQuantity.    
    */ 
    private _userSpecifiedMelds: Meld[];
    // Whether concealed specified melds can change depending on 
    // where the most recent tile is placed (_mostRecentTileContext.userSpecifiedMeld must be undefined)
    // The default is false in order to maximize point counting. 
    // The melds might become exposed or the most recent tile may be inserted into them.
    private _lockConcealedSpecifiedMelds: boolean;
    private _flowerTiles: FlowerTile[];

    constructor(tiles: HongKongTile[], mostRecentTileContext: MostRecentTileContext, 
        userSpecifiedMelds?: Meld[], lockConcealedSpecifiedMelds: boolean = false) {
        assertTilesNotNullAndCorrectLength(tiles, handMinLengthWithoutFlowers, handMaxLength);
        assertTilesHongKongTile(tiles)

        this._flowerTiles = []; 
        for (const tile of tiles) {
            if (isFlowerTile(tile)) {
                this._flowerTiles.push(tile);
            }
        }
        if (!tilesUnique(this._flowerTiles)) {
            throw new TypeError("A HK Hand cannot have duplicate flower tiles.");
        }
        if (this._flowerTiles.length > handMaxNumUniqueFlowers) {
            throw new TypeError("A HK Hand can only have max " + handMaxNumUniqueFlowers + " number of flower tiles. Found " + this._flowerTiles.length);
        }
        
        const suitedOrHonorTiles : SuitedOrHonorTile[] = [];
        for (const tile of tiles) {
            if (isSuitedOrHonorTile(tile)) {
                suitedOrHonorTiles.push(tile);
            }
        }
        if (suitedOrHonorTiles.length < handMinLengthWithoutFlowers) {
            throw new TypeError("A HK Hand must have at least " + handMinLengthWithoutFlowers + " suited or honor tiles. Found " + suitedOrHonorTiles.length);
        }
        if (suitedOrHonorTiles.length > handMaxLengthWithoutFlowers) {
            throw new TypeError("A HK Hand must have less than " + handMaxLengthWithoutFlowers + " suited or honor tiles. Found " + suitedOrHonorTiles.length);
        }
        assertEachTileHasQuantityLTEMaxPerTile(suitedOrHonorTiles);

        const tileToQuantity : TileToQuantityMap = new TileToQuantityMap(tiles);

        if (userSpecifiedMelds && userSpecifiedMelds.length > 0) {
            const meldTiles = toFlatTiles(userSpecifiedMelds);
            const meldTileToQuantity = new TileToQuantityMap(meldTiles);
            for (const tile of meldTiles) {
                if (meldTileToQuantity.getQuantity(tile) > tileToQuantity.getQuantity(tile)) {
                    throw new TypeError(`A Hand's pre-specified melds must be a subset of the provided tiles. ` + 
                        `For ${tile.value} ${tile.group}, there are ${meldTileToQuantity.getQuantity(tile)} of them in melds, but ` + 
                        `${tileToQuantity.getQuantity(tile)} in tiles.`);
                }
            }
        }
        if (mostRecentTileContext.userSpecifiedMeld && (!userSpecifiedMelds || !meldExistsInMelds(userSpecifiedMelds, mostRecentTileContext.userSpecifiedMeld))) {
            throw new Error(`userSpecifiedMelds must contain the most recent tile context's userSpecifiedMeld if one is defined.`);
        }

        if (tileToQuantity.getQuantity(mostRecentTileContext.tile) === 0) {
            throw new TypeError("mostRecentTile must be present in the tiles array.");
        }

        this._tileToQuantity = tileToQuantity;
        this._mostRecentTileContext = mostRecentTileContext;
        this._userSpecifiedMelds = userSpecifiedMelds ?? [];
        this._lockConcealedSpecifiedMelds = lockConcealedSpecifiedMelds;
    }

    get tileToQuantity() {
        return this._tileToQuantity;
    }

    getQuantity(tile: Tile) : number;
    getQuantity(group: TileGroup, value: TileValue) : number;
    getQuantity(tileOrGroup: Tile | TileGroup, valueArg?: TileValue) : number {
        if (tileOrGroup instanceof Tile) {
            return this._tileToQuantity.getQuantity(tileOrGroup);
        } else if (!valueArg) {
            throw new Error("value cannot be null or undefined");
        } else {
            return this._tileToQuantity.getQuantity(tileOrGroup, valueArg);
        }
    }

    getQuantitiesForTileGroup(group: TileGroup): ReadonlyMap<TileValue, number> {
        return this._tileToQuantity.getQuantitiesForTileGroup(group);
    }

    getQuantityPerUniqueTile(includeFlowerTiles?: boolean): number[] {
        return this._tileToQuantity.getQuantityPerUniqueTile(includeFlowerTiles);
    }

    getTotalQuantity(includeFlowerTiles?: boolean) : number {
        return this._tileToQuantity.getTotalQuantity(includeFlowerTiles);
    }

    getQuantityToTileMap(includeFlowerTiles?: boolean) : ReadonlyMap<number, Tile[]> {
        return this._tileToQuantity.getQuantityToTileMap(includeFlowerTiles);
    }

    get flowerTiles() {
        return this._flowerTiles;
    }

    mostRecentTile() : SuitedOrHonorTile {
        return this._mostRecentTileContext.tile;
    }

    mostRecentTileIsSelfDrawn() : boolean{
        return this._mostRecentTileContext.isSelfDrawn;
    }

    mostRecentTileUserSpecifiedMeld() : Meld | undefined {
        return this._mostRecentTileContext.userSpecifiedMeld;
    }

    get userSpecifiedMelds() {
        return this._userSpecifiedMelds;
    }

    get lockConcealedSpecifiedMelds() {
        return this._lockConcealedSpecifiedMelds
    }
}