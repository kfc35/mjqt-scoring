import { TileGroup } from "model/tile/tileGroup";
import SuitedTile from "model/tile/group/suitedTile";

export default class CharacterTile extends SuitedTile {
    getGroup(): TileGroup.CHARACTER {
        return TileGroup.CHARACTER;
    }
}