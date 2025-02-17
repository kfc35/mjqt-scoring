import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createPPResultBasedOnBooleanFlagWithTileDetail } from "service/point/predicate/impl/util/pointPredicateUtil";
import { FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE } from "common/deck";
import { winByAnyReplacementPredicate, WIN_BY_KONG_PREDICATE } from "service/point/predicate/impl/winCondition/winConditionPredicate";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { meldIsChow } from "model/meld/chow";
import { RootPointPredicateConfiguration } from "../../configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "../../configuration/logic/pointPredicateLogicConfiguration";
import WinContext from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultMeldDetail from "../../result/meldBased/pointPredicateSuccessResultMeldDetail";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultMeldDetail from "../../result/meldBased/pointPredicateFailureResultMeldDetail";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";

const winningTileIsFiveCircleSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE, 
            FIVE_CIRCLE.equals(standardWinningHand.winningTile), 
            new PointPredicateSuccessResultTileDetail.Builder().tilesThatSatisfyPredicate([[standardWinningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetail.Builder().tilesThatFailPredicate([[standardWinningHand.winningTile]])
                .tilesThatAreMissingToSatisfyPredicate([[FIVE_CIRCLE]]).build());
    }

const winningMeldIsFourFiveSixCircleChowSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const winningTileMeld = standardWinningHand.meldWithWinningTile;
        const winningTileMeldIsFourFiveSixCircle = meldIsChow(winningTileMeld) 
        && winningTileMeld.tiles[0].equals(FOUR_CIRCLE) && winningTileMeld.tiles[1].equals(FIVE_CIRCLE) && 
        winningTileMeld.tiles[2].equals(SIX_CIRCLE);
        if (winningTileMeldIsFourFiveSixCircle) {
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldsThatSatisfyPredicate([winningTileMeld])
                    .meldIndicesThatSatisfyPredicate(new Set([standardWinningHand.meldWithWinningTileIndex]))
                    .build()
                ).build();
        } else {
            return new PointPredicateFailureResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetail.Builder()
                    .meldsThatFailPredicate([winningTileMeld])
                    .meldIndicesThatFailPredicate(new Set([standardWinningHand.meldWithWinningTileIndex]))
                    .build()
                ).build();
        }
    }

const replacementPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand, winCtx: WinContext, roundCtx: RoundContext, config: RootPointPredicateConfiguration) => {
        if (config.getLogicConfiguration().getOptionValue(PointPredicateLogicOption.PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED)) {
            return winByAnyReplacementPredicate(standardWinningHand, winCtx, roundCtx, config);
        }
        return WIN_BY_KONG_PREDICATE(standardWinningHand, winCtx, roundCtx, config);
    }

export const PLUM_BLOSSOM_ON_THE_ROOF : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF, winningTileIsFiveCircleSubPredicate, 
        winningMeldIsFourFiveSixCircleChowSubPredicate, replacementPredicate
    );