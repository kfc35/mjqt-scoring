import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { RoundContext } from "model/roundContext/roundContext";
import WinContext from "model/winContext/winContext";
import { RootPointPredicateConfiguration } from "../../configuration/root/rootPointPredicateConfiguration";
import { PointPredicate } from "../../pointPredicate";

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
export function createPointPredicateSwitcher(meldBasedPointPredicate: PointPredicate<MeldBasedWinningHand>,
    specialPointPredicate: PointPredicate<SpecialWinningHand>): PointPredicate<WinningHand> {
    return (winningHand: WinningHand, winCtx: WinContext, roundCtx: RoundContext, config: RootPointPredicateConfiguration) => {
        if (winningHand instanceof SpecialWinningHand) {
            return specialPointPredicate(winningHand, winCtx, roundCtx, config);
        }
        else if (winningHand instanceof MeldBasedWinningHand) {
            return meldBasedPointPredicate(winningHand, winCtx, roundCtx, config);
        }
        throw new Error('winningHand not instanceOf either implementing class of WinningHand');
    };
}
