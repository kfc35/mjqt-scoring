//import { WinCondition } from "model/hand/hk/winCondition";
import { FlowerTile } from "model/tile/group/flowerTile";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import Meld from "model/meld/meld";
import { TileGroupValueMaps } from "model/hand/hk/winningHand/tileGroupValueMaps";

export interface WinningHand {
    getMelds() : ReadonlyArray<Meld>;
    getTiles() : SuitedOrHonorTile[][];
    get tileGroupValueMaps() : TileGroupValueMaps;
    get meldWithWinningTile() : Meld | undefined; // undefined for special only
    get winningTile() : SuitedOrHonorTile;
    isSelfDrawn() : boolean;
    get flowerTiles() : FlowerTile[];
}