import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateResult } from "service/point/predicate/result/pointPredicateResult";
import { PointPredicateSingleSuccessResult } from "service/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateFailureResult } from "service/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultTileDetail } from "service/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { createPointPredicateRouter } from "service/point/predicate/impl/util/pointPredicateUtil";
import { handContainsHonorsSubPredicate } from "service/point/predicate/impl/tileBased/tileBasedSharedSubPredicate";

function handContainsNoSuitsSubPredicate(winningHand: WinningHand): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const tilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    if (suitedTileGroups.size === 0) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)
            .build();
    } else {
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_SUITS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatFailPredicate(tilesSepBySuit)
                    .build()
            )
            .build();
    }
}

const allHonorsMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
    return allHonorsPredicate(meldBasedWinningHand, honorTileIndices);
};

const allHonorsSpecialPredicate: PointPredicate<SpecialWinningHand> = (specialWinningHand: SpecialWinningHand) => {
    return allHonorsPredicate(specialWinningHand);
};

function allHonorsPredicate(winningHand: WinningHand, honorTileIndicesSet: Set<number> = new Set()): PointPredicateResult {
    return PointPredicateResult.and(PointPredicateID.ALL_HONORS,
        handContainsNoSuitsSubPredicate(winningHand),
        handContainsHonorsSubPredicate(winningHand, honorTileIndicesSet)
    );
}

export const ALL_HONORS_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouter(allHonorsMeldBasedPredicate, allHonorsSpecialPredicate);