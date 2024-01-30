import { TileGroup } from "model/tile/tileGroup";
import SuitedTile from "model/tile/group/suitedTile";

export default class BambooTile extends SuitedTile {
    getGroup(): TileGroup.BAMBOO {
        return TileGroup.BAMBOO;
    }
}
