import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicate, predicateAnd } from "service/point/predicate/pointPredicate";
import { handContainsOneSuitSubPredicate } from "service/point/predicate/impl/tileBased/tileBasedSharedSubPredicate";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateFailureResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";

function handContainsNoHonorsSubPredicate(winningHand: WinningHand): PointPredicateResult {
    const tileGroupValueMaps = winningHand.tileGroupValueMaps;
    const honorTileGroups = tileGroupValueMaps.getHonorTileGroups();
    const honorTiles: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(honorTileGroups);
    if (honorTileGroups.size === 0) {
        return new PointPredicateSingleSuccessResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)
            .build();
    } else {
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.SUBPREDICATE_HAND_CONTAINS_NO_HONORS)
            .tileDetail(
                new PointPredicateFailureResultTileDetailBuilder()
                    .tilesThatFailPredicate(honorTiles)
                    .build()
            )
            .build();
    }
}

export const ALL_ONE_SUIT_PREDICATE: PointPredicate<WinningHand> = predicateAnd(PointPredicateID.ALL_ONE_SUIT, 
    handContainsOneSuitSubPredicate, handContainsNoHonorsSubPredicate);

