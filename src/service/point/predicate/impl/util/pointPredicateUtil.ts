import { Tile } from "model/tile/tile";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import { tilesListIsEmpty } from "common/tileUtils";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";

export function createPointPredicateResultBasedOnBooleanFlag(pointPredicateId: string, flag: boolean, tilesList: ReadonlyArray<ReadonlyArray<Tile>>): PointPredicateResult {
    if (flag) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(pointPredicateId)
            .tileDetail(new PointPredicateSuccessResultTileDetail.Builder()
                .tilesThatSatisfyPredicate(tilesListIsEmpty(tilesList) ? [] : [...tilesList.map(tiles => [...tiles])])
                .build()
            )
            .build();
    }
    return new PointPredicateFailureResult.Builder()
            .pointPredicateId(pointPredicateId)
            .tileDetail(new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate(tilesListIsEmpty(tilesList) ? [] : [...tilesList.map(tiles => [...tiles])])
                .build()
            )
            .build();
}