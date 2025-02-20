import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "../../pointPredicate";
import PointPredicateSuccessResultMeldDetail from "../../result/meldBased/pointPredicateSuccessResultMeldDetail";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateResult from "../../result/pointPredicateResult";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import { createPointPredicateRouter } from "../util/pointPredicateUtil";

function voidedSuitPredicate(winningHand: WinningHand, suitedTileIndicesSet: Set<number> = new Set()): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);

    if (suitedTileGroups.size == 2) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.VOIDED_SUIT)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldIndicesThatSatisfyPredicate(suitedTileIndicesSet)
                    .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate(tilesSepBySuit)
                    .build()
            )
            .build();
    }
    return new PointPredicateFailureResult.Builder()
        .pointPredicateId(PointPredicateID.VOIDED_SUIT)
        .tileDetail(
            new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatFailPredicate(tilesSepBySuit)
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