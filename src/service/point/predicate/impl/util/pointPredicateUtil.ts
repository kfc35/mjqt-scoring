import { Tile } from "model/tile/tile";
import PointPredicateResult from "service/point/predicate/pointPredicateResult";
import { tilesIsEmpty } from "common/tileUtils";

export function createPointPredicateResultBasedOnBooleanFlag(pointPredicateId: string, flag: boolean, tiles: Tile[][]): PointPredicateResult {
    if (flag) {
        return new PointPredicateResult(pointPredicateId, flag, tilesIsEmpty(tiles) ? [] : [tiles], [], [], new Set(), []);
    }
    return new PointPredicateResult(pointPredicateId, flag, [], tilesIsEmpty(tiles) ? [] : tiles, [], new Set(), []);
}