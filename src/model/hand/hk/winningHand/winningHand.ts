//import { WinCondition } from "model/hand/hk/winCondition";
import { FlowerTile } from "model/tile/group/flowerTile";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { TileGroupValueMaps } from "model/hand/hk/winningHand/tileGroupValueMaps";

export interface WinningHand {
    get tiles(): ReadonlyArray<ReadonlyArray<SuitedOrHonorTile>>;
    get tilesIndexWithWinningTile(): number;
    get tileGroupValueMaps() : TileGroupValueMaps;
    get winningTile() : SuitedOrHonorTile;
    get winningTileIsPartOfPair() :  boolean;
    isSelfDrawn() : boolean;
    get flowerTiles() : FlowerTile[];
}