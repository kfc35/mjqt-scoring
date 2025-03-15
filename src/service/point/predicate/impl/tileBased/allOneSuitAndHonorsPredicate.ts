import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { handContainsOneSuitSubPredicate, handContainsHonorsSubPredicate } from "service/point/predicate/impl/tileBased/tileBasedSharedSubPredicate";
import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { createPointPredicateRouter } from "service/point/predicate/impl/util/pointPredicateUtil";

function allOneSuitAndHonorsPredicate(winningHand: WinningHand, suitedTileIndicesSet: Set<number> = new Set(), honorTileIndicesSet: Set<number> = new Set()): PointPredicateResult {
    return PointPredicateResult.and(PointPredicateID.ALL_ONE_SUIT_AND_HONORS,
        handContainsOneSuitSubPredicate(winningHand, suitedTileIndicesSet),
        handContainsHonorsSubPredicate(winningHand, honorTileIndicesSet)
    );
}

const allOneSuitAndHonorsMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
    const honorTileIndices = consolidateSets([...honorTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForHonorTileGroup(tileGroup)));
    return allOneSuitAndHonorsPredicate(meldBasedWinningHand, suitedTileIndices, honorTileIndices);
};

const allOneSuitAndHonorsSpecialPredicate: PointPredicate<SpecialWinningHand> = (specialWinningHand: SpecialWinningHand) => {
    return allOneSuitAndHonorsPredicate(specialWinningHand);
};

export const ALL_ONE_SUIT_AND_HONORS_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouter(allOneSuitAndHonorsMeldBasedPredicate, allOneSuitAndHonorsSpecialPredicate);

