import { PointPredicate } from "service/point/predicate/pointPredicate";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createPointPredicateResultBasedOnBooleanFlag } from "service/point/predicate/impl/util/pointPredicateUtil";
import { FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE } from "common/deck";
import { winByAnyReplacementPredicate, WIN_BY_KONG_PREDICATE } from "service/point/predicate/impl/winCondition/winConditionPredicate";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { meldIsChow } from "model/meld/chow";
import { RootPointPredicateConfiguration } from "../../configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "../../configuration/logic/pointPredicateLogicConfiguration";
import WinContext from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";

const winningTileIsFiveCircleSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE, FIVE_CIRCLE.equals(standardWinningHand.winningTile), [[standardWinningHand.winningTile]]);
    }

const winningMeldIsFourFiveSixCircleChowSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const winningTileMeld = standardWinningHand.meldWithWinningTile;
        const winningTileMeldIsFourFiveSixCircle = meldIsChow(winningTileMeld) 
        && winningTileMeld.tiles[0].equals(FOUR_CIRCLE) && winningTileMeld.tiles[1].equals(FIVE_CIRCLE) && 
        winningTileMeld.tiles[2].equals(SIX_CIRCLE);
        return createPointPredicateResultBasedOnBooleanFlag(PointPredicateID.SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW, winningTileMeldIsFourFiveSixCircle, 
            [standardWinningHand.meldWithWinningTile.tiles]);
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