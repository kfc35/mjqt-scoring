//import { WinCondition } from "model/hand/hk/winCondition";
import { FlowerTile } from "model/tile/group/flowerTile";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld from "model/meld/meld";
import { TileGroupValueMaps } from "model/hand/hk/winningHand/tileGroupValueMaps";

export interface WinningHand {
    // TODO should we remove the meld stuff?
    getMelds() : ReadonlyArray<Meld>;
    getTiles() : ReadonlyArray<ReadonlyArray<SuitedOrHonorTile>>;
    get tileGroupValueMaps() : TileGroupValueMaps;
    get meldWithWinningTileIndex() : number | undefined; // undefined for special only
    get winningTile() : SuitedOrHonorTile;
    isSelfDrawn() : boolean;
    get flowerTiles() : FlowerTile[];
}