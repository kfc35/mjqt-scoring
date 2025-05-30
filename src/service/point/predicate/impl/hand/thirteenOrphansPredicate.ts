import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { thirteenOrphanTiles } from "service/handAnalyzer/base/specialWinningHandAnalyzer/impl/thirteenOrphansAnalyzer";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateSuccessResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateFailureResultMeldDetailBuilder } from "model/point/predicate/result/meldBased/pointPredicateFailureResultMeldDetail";
import { PointPredicateFailureResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import { getAllIndicesSet } from "common/meldUtils";
import { createPointPredicateRouter } from "service/point/predicate/impl/util/pointPredicateUtil";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { thirteenOrphansAnalyzer } from "service/handAnalyzer/base/specialWinningHandAnalyzer/impl/thirteenOrphansAnalyzer";

export const thirteenOrphansSpecialPredicate : PointPredicate<SpecialWinningHand> = 
    (specialWinningHand: SpecialWinningHand) => {
        if (specialWinningHand.specialWinningHandType === SpecialWinningHandType.THIRTEEN_ORPHANS && 
            thirteenOrphansAnalyzer(specialWinningHand.toHand()).length > 0) {
            return new PointPredicateSingleSuccessResultBuilder()
                .pointPredicateId(PointPredicateID.THIRTEEN_ORPHANS)
                .tileDetail(
                    new PointPredicateSuccessResultTileDetailBuilder()
                    .tilesThatSatisfyPredicate(specialWinningHand.tiles.map(tiles => tiles.map(tile => tile)))
                    .build()
                ).build();
        }
        return new PointPredicateFailureResultBuilder()
            .pointPredicateId(PointPredicateID.THIRTEEN_ORPHANS)
            .tileDetail(
                new PointPredicateFailureResultTileDetailBuilder()
                .tilesThatAreMissingToSatisfyPredicate([thirteenOrphanTiles])
                .tilesThatAreMissingAnyOfToSatisfyPredicate([thirteenOrphanTiles])
                .build()
            ).build();
    }

export const thirteenOrphansMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    (meldBasedWinningHand: MeldBasedWinningHand) => {
        return new PointPredicateFailureResultBuilder()
        .pointPredicateId(PointPredicateID.THIRTEEN_ORPHANS)
        .meldDetail(
            new PointPredicateFailureResultMeldDetailBuilder()
            .meldsThatFailPredicate([...meldBasedWinningHand.melds])
            .meldIndicesThatFailPredicate(getAllIndicesSet(meldBasedWinningHand.melds))
            .build()
        )
        .tileDetail(
            new PointPredicateFailureResultTileDetailBuilder()
            .tilesThatAreMissingToSatisfyPredicate([thirteenOrphanTiles])
            .tilesThatAreMissingAnyOfToSatisfyPredicate([thirteenOrphanTiles])
            .build()
        ).build();
    }

export const THIRTEEN_ORPHANS_PREDICATE : PointPredicate<WinningHand> = 
    createPointPredicateRouter(thirteenOrphansMeldBasedPredicate, thirteenOrphansSpecialPredicate);