import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { thirteenOrphanTiles } from "service/handAnalyzer/base/specialWinningHandAnalyzer/impl/thirteenOrphansAnalyzer";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import PointPredicateSingleSuccessResult from "../../result/pointPredicateSingleSuccessResult";
import PointPredicateSuccessResultTileDetail from "../../result/tile/pointPredicateSuccessResultTileDetail";
import PointPredicateFailureResult from "../../result/pointPredicateFailureResult";
import PointPredicateFailureResultTileDetail from "../../result/tile/pointPredicateFailureResultTileDetail";
import PointPredicateFailureResultMeldDetail from "../../result/meldBased/pointPredicateFailureResultMeldDetail";
import { getAllIndicesSet } from "common/meldUtils";

export const THIRTEEN_ORPHANS_PREDICATE : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand: SpecialWinningHand) => {
        if (specialWinningHand.specialWinningHandType === SpecialWinningHandType.THIRTEEN_ORPHANS) {
            return new PointPredicateSingleSuccessResult.Builder()
                .pointPredicateId(PointPredicateID.THIRTEEN_ORPHANS)
                .tileDetail(
                    new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate(specialWinningHand.tiles.map(tiles => tiles.map(tile => tile)))
                    .build()
                ).build();
        }
        return new PointPredicateFailureResult.Builder()
            .pointPredicateId(PointPredicateID.THIRTEEN_ORPHANS)
            .tileDetail(
                new PointPredicateFailureResultTileDetail.Builder()
                .tilesThatAreMissingToSatisfyPredicate([thirteenOrphanTiles])
                .build()
            ).build();
    }

export const THIRTEEN_ORPHANS_PREDICATE_MELD_BASED : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand: MeldBasedWinningHand) => {
        return new PointPredicateFailureResult.Builder()
        .pointPredicateId(PointPredicateID.THIRTEEN_ORPHANS)
        .meldDetail(
            new PointPredicateFailureResultMeldDetail.Builder()
            .meldsThatFailPredicate([...meldBasedWinningHand.melds])
            .meldIndicesThatFailPredicate(getAllIndicesSet(meldBasedWinningHand.melds))
            .build()
        )
        .tileDetail(
            new PointPredicateFailureResultTileDetail.Builder()
            .tilesThatAreMissingToSatisfyPredicate([thirteenOrphanTiles])
            .build()
        ).build();
    }