import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultTileDetail } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateSuccessResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultTileDetail } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { createPointPredicateRouter } from "service/point/predicate/impl/util/pointPredicateUtil";
import { partitionTilesByGroup } from "common/tileUtils";
import { SUITED_TILES } from "common/deck";

function voidedSuitPredicate(winningHand: WinningHand, suitedTileIndicesSet?: Set<number>): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);

    if (suitedTileGroups.size == 2) {
        const resultBuilder = new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.VOIDED_SUIT)
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate(tilesSepBySuit)
                    .build()
            );
        if (suitedTileIndicesSet) {
            resultBuilder.meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldIndicesThatSatisfyPredicate(suitedTileIndicesSet)
                    .build()
            );
        }
        return resultBuilder.build();
    }
    if (suitedTileGroups.size > 0) {
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.VOIDED_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatFailPredicate(tilesSepBySuit)
                    .build()
            )
             .build();
    }
    return new PointPredicateFailureResult.Builder()
        .pointPredicateId(PointPredicateID.VOIDED_SUIT)
        .tileDetail(
            new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatAreMissingAnyOfToSatisfyPredicate(partitionTilesByGroup(SUITED_TILES))
                .build()
        )
            .build();
}

const voidedSuitMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));

    return voidedSuitPredicate(meldBasedWinningHand, suitedTileIndices);
};

const voidedSuitSpecialPredicate: PointPredicate<SpecialWinningHand> = (specialWinningHand: SpecialWinningHand) => {
    return voidedSuitPredicate(specialWinningHand);
};

export const VOIDED_SUIT_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouter(voidedSuitMeldBasedPredicate, voidedSuitSpecialPredicate);