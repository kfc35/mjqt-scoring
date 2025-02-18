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
    successTileDetail?: PointPredicateSuccessResultTileDetail,
    failureTileDetail?: PointPredicateFailureResultTileDetail): PointPredicateResult {
    if (flag) {
        const successResultBuilder = new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(pointPredicateId);
        if (!!successTileDetail) {
            successResultBuilder.tileDetail(successTileDetail);
        }
        return successResultBuilder.build();
    }
    const failureResultBuilder = new PointPredicateFailureResult.Builder()
            .pointPredicateId(pointPredicateId);
    if (!!failureTileDetail) {
        failureResultBuilder.tileDetail(failureTileDetail);
    }
    return failureResultBuilder.build();
}

export function createGenericPointPredicateRouter(meldBasedPointPredicate: PointPredicate<MeldBasedWinningHand>,
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

function createAutoFailureSpecialPredicate(pointPredicateId: string): PointPredicate<SpecialWinningHand> {
    return () => new PointPredicateFailureResult(pointPredicateId);
}

function createAutoSuccessSpecialPredicate(pointPredicateId: string): PointPredicate<SpecialWinningHand> {
    return () => new PointPredicateSingleSuccessResult(pointPredicateId);
}

export function createPointPredicateRouterWithAutoFailSpecialPredicate(pointPredicateId: string, meldBasedPointPredicate: PointPredicate<MeldBasedWinningHand>): PointPredicate<WinningHand> {
    return createGenericPointPredicateRouter(meldBasedPointPredicate, 
        createAutoFailureSpecialPredicate(pointPredicateId)
    );
}

export function createPointPredicateRouterWithAutoSucessSpecialPredicate(pointPredicateId: string, meldBasedPointPredicate: PointPredicate<MeldBasedWinningHand>): PointPredicate<WinningHand> {
    return createGenericPointPredicateRouter(meldBasedPointPredicate, 
        createAutoSuccessSpecialPredicate(pointPredicateId)
    );
}
