import { SuitedTile, type SuitedTileGroup } from "model/tile/group/suitedTile";
import { SuitedTileValue } from "model/tile/tileValue";
import { TileGroup } from "model/tile/tileGroup";
import { BambooTile } from "model/tile/group/bambooTile";
import { CharacterTile } from "model/tile/group/characterTile";
import { CircleTile } from "model/tile/group/circleTile";

export function constructSuitedTile(group: SuitedTileGroup, value: SuitedTileValue) : SuitedTile {
    switch (group) {
        case TileGroup.BAMBOO:
            return new BambooTile(value);
        case TileGroup.CHARACTER:
            return new CharacterTile(value);
        case TileGroup.CIRCLE:
            return new CircleTile(value);
        default:
            throw new Error("Non exhaustive TileGroup Check");
    }
}
