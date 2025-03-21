import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createPointPredicateRouterWithAutoFailSpecialPredicate, createPPResultBasedOnBooleanFlagWithTileDetail } from "service/point/predicate/impl/util/pointPredicateUtil";
import { FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE } from "common/deck";
import { winByAnyReplacementSubPredicate, WIN_BY_KONG_PREDICATE } from "service/point/predicate/impl/winCondition/basicWinConditionPredicate";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { Chow, meldIsChow } from "model/meld/chow";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateSuccessResultMeldDetailBuilder } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultMeldDetailBuilder } from "model/point/predicate/result/meldBased/pointPredicateFailureResultMeldDetail";
import { PointPredicateFailureResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";

const winningTileIsFiveCircleSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        return createPPResultBasedOnBooleanFlagWithTileDetail(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE, 
            FIVE_CIRCLE.equals(standardWinningHand.winningTile), 
            new PointPredicateSuccessResultTileDetailBuilder().tilesThatSatisfyPredicate([[standardWinningHand.winningTile]]).build(), 
            new PointPredicateFailureResultTileDetailBuilder().tilesThatFailPredicate([[standardWinningHand.winningTile]])
                .tilesThatAreMissingToSatisfyPredicate([[FIVE_CIRCLE]]).build());
    }

const winningMeldIsFourFiveSixCircleChowSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const winningTileMeld = standardWinningHand.meldWithWinningTile;
        const winningTileMeldIsFourFiveSixCircle = meldIsChow(winningTileMeld) 
        && winningTileMeld.tiles[0].equals(FOUR_CIRCLE) && winningTileMeld.tiles[1].equals(FIVE_CIRCLE) && 
        winningTileMeld.tiles[2].equals(SIX_CIRCLE);
        if (winningTileMeldIsFourFiveSixCircle) {
            return new PointPredicateSingleSuccessResultBuilder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetailBuilder()
                    .meldsThatSatisfyPredicate([winningTileMeld])
                    .meldIndicesThatSatisfyPredicate(new Set([standardWinningHand.meldWithWinningTileIndex]))
                    .build()
                ).build();
        } else {
            return new PointPredicateFailureResultBuilder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW)
                .meldDetail(
                    new PointPredicateFailureResultMeldDetailBuilder()
                    .meldsThatFailPredicate([winningTileMeld])
                    .meldIndicesThatFailPredicate(new Set([standardWinningHand.meldWithWinningTileIndex]))
                    .meldsThatAreMissingToSatisfyPredicate([new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])])
                    .build()
                ).build();
        }
    }

const replacementPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand, winCtx: WinContext, roundCtx: RoundContext, config: RootPointPredicateConfiguration) => {
        if (config.pointPredicateLogicConfiguration.getOptionValue(PointPredicateLogicOption.PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED)) {
            return winByAnyReplacementSubPredicate(standardWinningHand, winCtx, roundCtx, config);
        }
        return WIN_BY_KONG_PREDICATE(standardWinningHand, winCtx, roundCtx, config);
    }

const plumBlossomOnRoofMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF, winningTileIsFiveCircleSubPredicate, 
        winningMeldIsFourFiveSixCircleChowSubPredicate, replacementPredicate
    );

export const PLUM_BLOSSOM_ON_ROOF_PREDICATE = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF, plumBlossomOnRoofMeldBasedPredicate);