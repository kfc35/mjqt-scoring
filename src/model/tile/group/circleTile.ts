import { TileGroup } from "model/tile/tileGroup";
import SuitedTile from "model/tile/group/suitedTile";

export default class CircleTile extends SuitedTile {
    getGroup(): TileGroup.CIRCLE {
        return TileGroup.CIRCLE;
    }
}