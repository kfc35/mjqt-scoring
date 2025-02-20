import { PointPredicate } from "service/point/predicate/pointPredicate";
import { createPointPredicateRouterWithAutoFailSpecialPredicate } from "service/point/predicate/impl/util/pointPredicateUtil";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { predicateAnd } from "service/point/predicate/pointPredicate";
import { ALL_PONGS_AND_KONGS_PREDICATE } from "service/point/predicate/impl/hand/basicHandPredicate";
import { GREEN_DRAGON_PONG_KONG_PREDICATE, RED_DRAGON_PONG_KONG_PREDICATE, WHITE_DRAGON_PONG_KONG_PREDICATE } from "service/point/predicate/impl/meld/dragonPongPredicate";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue } from "model/tile/tileValue";
import { onePairSubPredicate } from "service/point/predicate/impl/meld/pairSubPredicates";
import { getSuitedTilesForSuitedTileGroup } from "common/deck";
import { getOnlyTruthyElement, consolidateSets } from "common/generic/setUtils";
import { getMeldsSubsetFromIndicesSet } from "common/meldUtils";
import { constructHonorTile } from "model/tile/group/honorTileConstructor";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import type { SuitedTileGroup } from "model/tile/group/suitedTile";
import PointPredicateSuccessResultMeldDetail from "service/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import PointPredicateFailureResult from "service/point/predicate/result/pointPredicateFailureResult";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import PointPredicateSingleSuccessResult from "service/point/predicate/result/pointPredicateSingleSuccessResult";
import PointPredicateFailureResultTileDetail from "service/point/predicate/result/tile/pointPredicateFailureResultTileDetail";
import PointPredicateSuccessResultTileDetail from "service/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";

export function allGivenSuitAndGivenDragonPredicate(pointPredicateId: string, meldBasedWinningHand: MeldBasedWinningHand,
    givenSuitedTileGroup: SuitedTileGroup, givenDragonTileValue: DragonTileValue): PointPredicateResult {
    const tileGroupValueMaps = meldBasedWinningHand.tileGroupValueMaps;
    const suitedTileGroups = tileGroupValueMaps.getSuitedTileGroups();
    const honorTileValues = tileGroupValueMaps.getHonorTileValues();
    const suitedTilesSepBySuit: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileGroups(suitedTileGroups);
    const honorTilesSepbyValue: SuitedOrHonorTile[][] = tileGroupValueMaps.getTilesForTileValues(honorTileValues);

    if (suitedTileGroups.size === 1 && givenSuitedTileGroup === getOnlyTruthyElement(suitedTileGroups) &&
        honorTileValues.size === 1 && givenDragonTileValue === getOnlyTruthyElement(honorTileValues)) {
        const suitedTileIndices = consolidateSets([...suitedTileGroups.values()].map(tileGroup => tileGroupValueMaps.getMeldIndicesForSuitedTileGroup(tileGroup)));
        const honorTileIndices = consolidateSets([...honorTileValues.values()].map(tileValue => tileGroupValueMaps.getMeldIndicesForHonorTileValue(tileValue)));
        const indices = consolidateSets([suitedTileIndices, honorTileIndices]);
        return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(pointPredicateId)
            .meldDetail(
                new PointPredicateSuccessResultMeldDetail.Builder()
                    .meldsThatSatisfyPredicate(getMeldsSubsetFromIndicesSet(meldBasedWinningHand.melds, indices))
                    .meldIndicesThatSatisfyPredicate(indices)
                    .build()
            )
            .tileDetail(
                new PointPredicateSuccessResultTileDetail.Builder()
                    .tilesThatSatisfyPredicate([...suitedTilesSepBySuit, ...honorTilesSepbyValue])
                    .build()
            )
            .build();
    }

    const failedTiles: SuitedOrHonorTile[][] = [];
    const missingTiles: SuitedOrHonorTile[][] = [];
    if (suitedTileGroups.size > 1) {
        failedTiles.push(...suitedTilesSepBySuit.filter(suitedTileList => !!suitedTileList[0] && suitedTileList[0].group !== givenSuitedTileGroup));
    } else if (suitedTileGroups.size === 0) {
        missingTiles.push(getSuitedTilesForSuitedTileGroup(givenSuitedTileGroup));
    } else if (honorTileValues.size > 1) {
        failedTiles.push(...honorTilesSepbyValue.filter(honorTileList => !!honorTileList[0] && honorTileList[0].value !== givenDragonTileValue));
    } else if (honorTileValues.size === 0) {
        missingTiles.push([constructHonorTile(TileGroup.DRAGON, givenDragonTileValue)]);
    }
    const tileDetail = new PointPredicateFailureResultTileDetail.Builder();
    if (!!failedTiles) {
        tileDetail.tilesThatFailPredicate(failedTiles);
    }
    if (!!missingTiles) {
        tileDetail.tilesThatAreMissingToSatisfyPredicate(missingTiles);
    }
    return new PointPredicateFailureResult.Builder()
        .pointPredicateId(pointPredicateId)
        .tileDetail(tileDetail.build())
        .build();
}

const allBambooAndGreenDragonSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON, standardWinningHand, 
            TileGroup.BAMBOO, DragonTileValue.GREEN);
    };
const jadeDragonMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allBambooAndGreenDragonSubPredicate,
        onePairSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        GREEN_DRAGON_PONG_KONG_PREDICATE);

const allCharacterAndRedDragonSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON, standardWinningHand, 
            TileGroup.CHARACTER, DragonTileValue.RED);
    };
const rubyDragonMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allCharacterAndRedDragonSubPredicate, 
        onePairSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        RED_DRAGON_PONG_KONG_PREDICATE);

const allCircleAndWhiteDragonSubPredicate : PointPredicate<MeldBasedWinningHand> = 
    (standardWinningHand : MeldBasedWinningHand) => {
        return allGivenSuitAndGivenDragonPredicate(PointPredicateID.SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON, standardWinningHand, 
            TileGroup.CIRCLE, DragonTileValue.WHITE);
    };
const pearlDragonMeldBasedPredicate : PointPredicate<MeldBasedWinningHand> = 
    predicateAnd(PointPredicateID.JADE_DRAGON, 
        allCircleAndWhiteDragonSubPredicate, 
        onePairSubPredicate, 
        ALL_PONGS_AND_KONGS_PREDICATE,
        WHITE_DRAGON_PONG_KONG_PREDICATE);

export const JADE_DRAGON_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.JADE_DRAGON, jadeDragonMeldBasedPredicate);
export const RUBY_DRAGON_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.RUBY_DRAGON, rubyDragonMeldBasedPredicate);
export const PEARL_DRAGON_PREDICATE : PointPredicate<WinningHand> = createPointPredicateRouterWithAutoFailSpecialPredicate(PointPredicateID.PEARL_DRAGON, pearlDragonMeldBasedPredicate);