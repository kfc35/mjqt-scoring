import { consolidateSets } from "common/generic/setUtils";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate } from "../../pointPredicate";
import { createPointPredicateRouter } from "../util/pointPredicateUtil";
import { handContainsOneSuitSubPredicate } from "./tileBasedSharedSubPredicate";
import PointPredicateResult from "../../result/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";

export const allOneSuitMeldBasedPredicate: PointPredicate<MeldBasedWinningHand> = (meldBasedWinningHand: MeldBasedWinningHand) => {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const suitedTileIndices: Set<number> = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
    return allOneSuitPredicate(meldBasedWinningHand, suitedTileIndices);
};

const allOneSuitSpecialPredicate: PointPredicate<SpecialWinningHand> = (specialWinningHand: SpecialWinningHand) => {
    return allOneSuitPredicate(specialWinningHand);
};

function allOneSuitPredicate(winningHand: WinningHand, wrappedSuitedTileIndicesSet: Set<number> = new Set()) : PointPredicateResult {
    return PointPredicateResult.and(PointPredicateID.ALL_ONE_SUIT, 
        handContainsOneSuitSubPredicate(winningHand, wrappedSuitedTileIndicesSet),
        handContainsNoHonorsSubPredicate(winningHand)
    );
}

export const ALL_ONE_SUIT_PREDICATE: PointPredicate<WinningHand> = createPointPredicateRouter(allOneSuitMeldBasedPredicate, allOneSuitSpecialPredicate);export function handContainsNoHonorsSubPredicate(winningHand: WinningHand): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    if (honorTileGroups.size === 0) {
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)
            .build();
    } else {
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                    .tilesThatFailPredicate(honorTiles)
                    .build()
            )
            .build();
    }
}

