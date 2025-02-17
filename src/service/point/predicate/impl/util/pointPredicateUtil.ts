import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";

export function createPPResultBasedOnBooleanFlagWithTileDetail(pointPredicateId: string, 
    flag: boolean,
    successTileDetail: PointPredicateSuccessResultTileDetail,
    failureTileDetail?: PointPredicateFailureResultTileDetail): PointPredicateResult {
    if (flag) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(pointPredicateId)
            .tileDetail(successTileDetail)
            .build();
    }
    const failureResultBuilder = new PointPredicateFailureResult.Builder()
            .pointPredicateId(pointPredicateId);
    if (!!failureTileDetail) {
        return failureResultBuilder.tileDetail(failureTileDetail)
        .build();
    } else {
        return failureResultBuilder.build();
    }
}