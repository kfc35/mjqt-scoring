import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { createMeldCheckerSuccessesQuantityPredicate } from "service/point/predicate/factory/meld/meldPredicateFactoryBase";
import Meld from "model/meld/meld";
import { meldIsPair } from "model/meld/pair";
import { meldIsKong } from "model/meld/kong";
import { meldIsPong } from "model/meld/pong";
import { createChowMinQuantityPredicate } from "service/point/predicate/factory/meld/chowPredicateFactory";
import { createKongMinQuantityPredicate } from "service/point/predicate/factory/meld/kongPredicateFactory";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultMeldDetail from "../../result/meldBased/pointPredicateSuccessResultMeldDetail";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultMeldDetail from "../../result/meldBased/pointPredicateFailureResultMeldDetail";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";

export const atLeastFourChowsSubPredicate : PointPredicate<MeldBasedWinningHand> = createChowMinQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_CHOWS, 4);
export const atLeastFourKongsSubPredicate : PointPredicate<MeldBasedWinningHand> = createKongMinQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_KONGS, 4);
export const atLeastFourPongsKongsSubPredicate : PointPredicate<MeldBasedWinningHand> = createMeldCheckerSuccessesQuantityPredicate(PointPredicateID.SUBPREDICATE_AT_LEAST_FOUR_PONGS_AND_KONGS, meld => meldIsKong(meld) || meldIsPong(meld), 4);

export const ifLastTileWasDiscardThenItCompletedPairSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const winningMeld : Meld = standardWinningHand.meldWithWinningTile;
        const winningMeldIndexSet = new Set<number>();
        winningMeldIndexSet.add(standardWinningHand.meldWithWinningTileIndex);
        if (!standardWinningHand.isSelfDrawn() && meldIsPair(winningMeld)) {
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldsThatSatisfyPredicate([winningMeld])
                    .meldIndicesThatSatisfyPredicate(winningMeldIndexSet)
                    .build()
                )
                .tileDetail(
                    new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([[standardWinningHand.winningTile]])
                    .build()
                )
                .build();
        } else if (standardWinningHand.isSelfDrawn()) { 
            // TODO is this confusing to have it be success?
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)
                .tileDetail(
                    new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([[standardWinningHand.winningTile]])
                    .build()
                )
                .build();
        } else { // last tile was discard but winning meld is not a pair
            return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)
            .meldDetail(
                new PointPredicateFailureResultMeldDetail.Builder()
                .meldsThatFailPredicate([winningMeld])
                .meldIndicesThatFailPredicate(winningMeldIndexSet)
                .build()
            )
            .build();
        }
    };

export const ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const winningMeld : Meld = standardWinningHand.meldWithWinningTile;
        const winningMeldIndexSet = new Set<number>();
        winningMeldIndexSet.add(standardWinningHand.meldWithWinningTileIndex);
        if (standardWinningHand.isSelfDrawn() && meldIsPair(winningMeld) ) {
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldsThatSatisfyPredicate([winningMeld])
                    .meldIndicesThatSatisfyPredicate(winningMeldIndexSet)
                    .build()
                )
                .tileDetail(
                    new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([[standardWinningHand.winningTile]])
                    .build()
                )
                .build();
        } else if (!standardWinningHand.isSelfDrawn()) { // winning tile is not self drawn
            // TODO is this confusing to have it be success?
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)
                .tileDetail(
                    new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([[standardWinningHand.winningTile]])
                    .build()
                )
                .build();
        } else { // last tile was self drawn but winning meld is not a pair
            return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR)
            .meldDetail(
                new PointPredicateFailureResultMeldDetail.Builder()
                .meldsThatFailPredicate([winningMeld])
                .meldIndicesThatFailPredicate(winningMeldIndexSet)
                .build()
            )
            .build();
        }
    };

export const lastTileCompletedPairSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand: MeldBasedWinningHand) => {
        const winningMeld: Meld = standardWinningHand.meldWithWinningTile;
        const winningMeldIndexSet = new Set<number>();
        winningMeldIndexSet.add(standardWinningHand.meldWithWinningTileIndex);
        if (meldIsPair(winningMeld)) {
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_LAST_TILE_COMPLETED_PAIR)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldsThatSatisfyPredicate([winningMeld])
                    .meldIndicesThatSatisfyPredicate(winningMeldIndexSet)
                    .build()
                )
                .tileDetail(
                    new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([[standardWinningHand.winningTile]])
                    .build()
                )
                .build();
        } else {
            return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_LAST_TILE_COMPLETED_PAIR)
            .meldDetail(
                new PointPredicateFailureResultMeldDetail.Builder()
                .meldsThatFailPredicate([winningMeld])
                .meldIndicesThatFailPredicate(winningMeldIndexSet)
                .build()
            )
            .build();
    }
};