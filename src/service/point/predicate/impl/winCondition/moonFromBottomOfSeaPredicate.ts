import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createPPResultBasedOnBooleanFlagWithTileDetail } from "service/point/predicate/impl/util/pointPredicateUtil";
import { ONE_CIRCLE } from "common/deck";
import { WIN_BY_LAST_TILE_PREDICATE } from "service/point/predicate/impl/winCondition/winConditionPredicate";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";

const winningTileIsOneCircleSubPredicate : PointPredicate<WinningHand> = 
    (winningHand: WinningHand) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE, 
            ONE_CIRCLE.equals(winningHand.winningTile), 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[winningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[winningHand.winningTile]])
                .tilesThatAreMissingToSatisfyPredicate([[ONE_CIRCLE]]).build());
    }

export const MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE : PointPredicate<WinningHand> = 
    predicateAnd(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA, winningTileIsOneCircleSubPredicate, 
        WIN_BY_LAST_TILE_PREDICATE
    );
