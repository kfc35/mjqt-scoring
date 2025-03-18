import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { Meld } from "model/meld/meld";
import { meldIsPair } from "model/meld/pair";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateFailureResultMeldDetail";
import { PointPredicateSuccessResultTileDetail } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { getMeldsSubsetFromIndicesSet } from "common/meldUtils";

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
                .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR)
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
        const winningMeldIndexSet = new Set<number>([standardWinningHand.meldWithWinningTileIndex]);
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

export const ifThereIsOnlyOneExposedMeldThenItIsMeldWithLastTileSubPredicate: PointPredicate<MeldBasedWinningHand> = 
    (winningHand: MeldBasedWinningHand) => {
        const meldWithWinningTile : Meld = winningHand.meldWithWinningTile;
        const winningMeldIndexSet = new Set<number>([winningHand.meldWithWinningTileIndex]);
        const exposedMelds : Meld[] = winningHand.melds.filter(meld => meld.exposed);
        const exposedMeldsIndex : Set<number> = new Set(winningHand.melds.map((meld, index) => [meld,index] as [Meld, number])
            .filter(([meld, _]) => meld.exposed)
            .map(([_, index]) => index));
        if (exposedMelds.length === 1 && meldWithWinningTile.equals(exposedMelds[0], false)) {
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)
                .meldDetail(
                    new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldsThatSatisfyPredicate([meldWithWinningTile])
                    .meldIndicesThatSatisfyPredicate(winningMeldIndexSet)
                    .build()
                )
                .tileDetail(
                    new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([[winningHand.winningTile]])
                    .build()
                )
                .build();
        } else if (exposedMelds.length !== 1) { 
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)
                .build();
        } else { // there is only one exposed meld but it is not the meld with the winning tile
            return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)
            .meldDetail(
                new PointPredicateFailureResultMeldDetail.Builder()
                .meldsThatFailPredicate(getMeldsSubsetFromIndicesSet(winningHand.melds, exposedMeldsIndex))
                .meldIndicesThatFailPredicate(exposedMeldsIndex)
                .build()
            )
            .build();
        }
    };