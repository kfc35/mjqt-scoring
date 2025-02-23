import HonorTile, { type HonorTileGroup } from "model/tile/group/honorTile";
import { type HonorTileValue } from "model/tile/group/honorTile";
import { TileGroup } from "model/tile/tileGroup";
import DragonTile from "model/tile/group/dragonTile";
import WindTile from "model/tile/group/windTile";
import { isDragonTileValue, isWindTileValue } from "model/tile/tileValue";

export function constructHonorTile(group: HonorTileGroup, value: HonorTileValue) : HonorTile {
    switch (group) {
        case TileGroup.DRAGON:
            if (isDragonTileValue(value)) {
                return new DragonTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        case TileGroup.WIND:
            if (isWindTileValue(value)) {
                return new WindTile(value);
            }
            throw new Error(`Unsupported Tile Combination: ${group} ${value}`);
        default:
            throw new Error("Non exhaustive TileGroup Check");
    }
}