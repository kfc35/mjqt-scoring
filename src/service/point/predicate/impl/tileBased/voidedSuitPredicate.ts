import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateSuccessResultMeldDetailBuilder } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { createPointPredicateRouter } from "service/point/predicate/impl/util/pointPredicateUtil";
import { partitionTilesByGroup } from "common/tileUtils";
import { SUITED_TILES } from "common/deck";

function voidedSuitPredicate(winningHand: WinningHand, suitedTileIndicesSet?: Set<number>): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);

    if (suitedTileGroups.size == 2) {
        const resultBuilder = new PointPredicateSingleSuccessResultBuilder()
            .pointPredicateId(PointPredicateID.VOIDED_SUIT)
            .tileDetail(
                new PointPredicateSuccessResultTileDetailBuilder()
                    .tilesThatSatisfyPredicate(tilesSepBySuit)
                    .build()
            );
        if (suitedTileIndicesSet) {
            resultBuilder.meldDetail(
                new PointPredicateSuccessResultMeldDetailBuilder()
                    .meldIndicesThatSatisfyPredicate(suitedTileIndicesSet)
                    .build()
            );
        }
        return resultBuilder.build();
    }
    if (suitedTileGroups.size > 0) {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.VOIDED_SUIT)
            .tileDetail(
                new PointPredicateFailureResultTileDetailBuilder()
                    .tilesThatFailPredicate(tilesSepBySuit)
                    .build()
            )
             .build();
    }
    return new PointPredicateFailureResultBuilder()
        .pointPredicateId(PointPredicateID.VOIDED_SUIT)
        .tileDetail(
            new PointPredicateFailureResultTileDetailBuilder()
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