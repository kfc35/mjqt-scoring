import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { Pong } from "model/meld/pong";
import { Pair } from "model/meld/pair";
import { Kong } from "model/meld/kong";
import { SEVEN_CHARACTER, EIGHT_CIRCLE, THREE_BAMBOO, FIVE_CHARACTER, THREE_CHARACTER,
    AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN, ONE_CHARACTER, ONE_CIRCLE,
    EIGHT_CHARACTER, NINE_CIRCLE, ONE_BAMBOO, NINE_BAMBOO, EAST_WIND, WEST_WIND,
    NINE_CHARACTER, NORTH_WIND, SOUTH_WIND, RED_DRAGON, WHITE_DRAGON, GREEN_DRAGON
 } from "common/deck";
import { CONCEALED_HAND_PREDICATE, FULLY_CONCEALED_PREDICATE, SELF_TRIPLETS_PREDICATE } from "service/point/predicate/impl/hand/concealedHandPredicate";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import type { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { Chow } from "model/meld/chow";
import type { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";

describe('concealedHandPredicate.ts', () => {
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('Self Triplets Predicate', () => {
        describe('Only Pongs Allowed = true', () => {
            beforeEach(() => {
                rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.SELF_TRIPLETS_ONLY_PONGS_ALLOWED, true);
            });

            test('hand with unexposed pongs only returns true', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    4, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = SELF_TRIPLETS_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.SELF_TRIPLETS);
                expect(result.success).toBe(true);
            });

            test('hand with an exposed pong only returns false', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER, true), 
                    new Pong(THREE_CHARACTER)], 
                    4, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = SELF_TRIPLETS_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.SELF_TRIPLETS);
                expect(result.success).toBe(false);
                const fourConcealedPongsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS) as PointPredicateFailureResult;
                expect(fourConcealedPongsResult.success).toBe(false);
                expect(fourConcealedPongsResult.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([3]));
                expect(fourConcealedPongsResult.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Pong(FIVE_CHARACTER, true)]);
            });

            test('unexposed mostly pong hand with one chow returns false', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER]), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    4, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = SELF_TRIPLETS_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.SELF_TRIPLETS);
                expect(result.success).toBe(false);
                const fourConcealedPongsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS) as PointPredicateFailureResult;
                expect(fourConcealedPongsResult.success).toBe(false);
                expect(fourConcealedPongsResult.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([0]));
                expect(fourConcealedPongsResult.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER])]);
            });

            test('hand with unexposed pongs AND kongs returns false', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Kong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    4, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = SELF_TRIPLETS_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.SELF_TRIPLETS);
                expect(result.success).toBe(false);
                const fourConcealedPongsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS) as PointPredicateFailureResult;
                expect(fourConcealedPongsResult.success).toBe(false);
                expect(fourConcealedPongsResult.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([2]));
                expect(fourConcealedPongsResult.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Kong(THREE_BAMBOO)]);
            });
        });

        describe('Only Pongs Allowed = false', () => {
            beforeEach(() => {
                rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.SELF_TRIPLETS_ONLY_PONGS_ALLOWED, false);
            });

            test('hand with unexposed pongs only returns true', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    4, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = SELF_TRIPLETS_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.SELF_TRIPLETS);
                expect(result.success).toBe(true);
                const fourConcealedPongsKongsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS_AND_KONGS) as PointPredicateSingleSuccessResult;
                expect(fourConcealedPongsKongsResult.success).toBe(true);
            });

            test('hand with an exposed pong only returns false', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER, true), 
                    new Pong(THREE_CHARACTER)], 
                    4, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = SELF_TRIPLETS_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.SELF_TRIPLETS);
                expect(result.success).toBe(false);
                const fourConcealedPongsKongsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS_AND_KONGS) as PointPredicateFailureResult;
                expect(fourConcealedPongsKongsResult.success).toBe(false);
                expect(fourConcealedPongsKongsResult.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([3]));
                expect(fourConcealedPongsKongsResult.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Pong(FIVE_CHARACTER, true)]);
            });

            test('unexposed mostly pong hand with one chow returns false', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER]), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    4, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = SELF_TRIPLETS_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.SELF_TRIPLETS);
                expect(result.success).toBe(false);
                const fourConcealedPongsKongsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS_AND_KONGS) as PointPredicateFailureResult;
                expect(fourConcealedPongsKongsResult.success).toBe(false);
                expect(fourConcealedPongsKongsResult.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([0]));
                expect(fourConcealedPongsKongsResult.meldDetail?.meldsThatFailPredicate).toStrictEqual([new Chow([SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER])]);
            });

            test('hand with unexposed pongs AND kongs returns true', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Kong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    4, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = SELF_TRIPLETS_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.SELF_TRIPLETS);
                expect(result.success).toBe(true);
                const fourConcealedPongsKongsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS_AND_KONGS) as PointPredicateSingleSuccessResult;
                expect(fourConcealedPongsKongsResult.success).toBe(true);
            });
        });
    });

    describe('Concealed Hand Predicate', () => {
        describe('Last Discarded Tile Must Complete Pair = true', () => {
            beforeEach(() => {
                rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, true);
            });

            test('unexposed hand won via discard on pair returns true', () => {
                const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE, true), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(true);
                const fourConcealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
                expect(fourConcealedMeldsResult.success).toBe(true);
                expect(fourConcealedMeldsResult.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 2, 3, 4]));
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
            });

            test('unexposed hand won via discard on non pair returns false', () => {
                const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO, true), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(false);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
                expect(concealedMeldsResult.success).toBe(true);
                expect(concealedMeldsResult.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 3, 4]));
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(false);
            });

            test('hand won via self draw but with one previously exposed meld returns false', () => {
                const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER, true), 
                    new Pong(THREE_CHARACTER)], 
                    2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(false);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
                expect(concealedMeldsResult.success).toBe(true);
                expect(concealedMeldsResult.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 4]));
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(false);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
            });

            test('hand with more than one exposed meld returns false', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO, true), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER, true)], 
                    3, FIVE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(false);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateFailureResult;
                expect(concealedMeldsResult.success).toBe(false);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
            });

            test('seven pairs hand won via discard returns true', () => {
                const sevenPairs = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER, true),
                    new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(FIVE_CHARACTER)], 
                    2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                    const result = CONCEALED_HAND_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);

                    expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                    expect(result.success).toBe(true);
                    const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateFailureResult;
                    expect(concealedMeldsResult.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
            });

            test('seven pairs hand won via self draw returns true', () => {
                const sevenPairs = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                    new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(FIVE_CHARACTER)], 
                    2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                    const result = CONCEALED_HAND_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);

                    expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                    expect(result.success).toBe(true);
                    const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateFailureResult;
                    expect(concealedMeldsResult.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
                    expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBe(true);
            });
        });

        describe('Last Discarded Tile Must Complete Pair = false', () => {
            beforeEach(() => {
                rootConfig.pointPredicateLogicConfiguration.setOptionValue(PointPredicateLogicOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, false);
            });

            test('unexposed hand won via discard on pair returns true', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE, true), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(true);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
                expect(concealedMeldsResult.success).toBe(true);
                expect(concealedMeldsResult.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 2, 3, 4]));
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBeUndefined();
            });

            test('unexposed hand won via discard on non pair returns true', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO, true), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER)], 
                    2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(true);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
                expect(concealedMeldsResult.success).toBe(true);
                expect(concealedMeldsResult.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 3, 4]));
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBeUndefined();
            });

            test('hand with more than one exposed meld returns false', () => {
                const unexposedPongsHand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO, true), new Pong(FIVE_CHARACTER), 
                    new Pong(THREE_CHARACTER, true)], 
                    3, FIVE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(unexposedPongsHand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(false);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateFailureResult;
                expect(concealedMeldsResult.success).toBe(false);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR)?.success).toBeUndefined();
            });

            test('hand won via self draw but with one previously exposed meld returns false', () => {
                const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                    new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER, true), 
                    new Pong(THREE_CHARACTER)], 
                    2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(false);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
                expect(concealedMeldsResult.success).toBe(true);
                expect(concealedMeldsResult.meldDetail?.meldIndicesThatSatisfyPredicate).toStrictEqual(new Set([0, 1, 2, 4]));
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(false);
            });

            test('seven pairs hand won via discard returns true', () => {
                const sevenPairs = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER, true),
                    new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(FIVE_CHARACTER)], 
                    2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                    const result = CONCEALED_HAND_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(true);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateFailureResult;
                expect(concealedMeldsResult.success).toBe(true);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
            });

            test('seven pairs hand won via self draw returns true', () => {
                const sevenPairs = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pair(EIGHT_CIRCLE), new Pair(THREE_CHARACTER),
                    new Pair(NORTH_WIND), new Pair(ONE_CHARACTER), new Pair(WHITE_DRAGON), new Pair(FIVE_CHARACTER)], 
                    2, THREE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

                const result = CONCEALED_HAND_PREDICATE(sevenPairs, basicWinContext, basicRoundContext, rootConfig);

                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(true);
                const concealedMeldsResult = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED) as PointPredicateFailureResult;
                expect(concealedMeldsResult.success).toBe(true);
                expect(result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE)?.success).toBe(true);
            });
        });

        describe('special hand', () => {
            test('special hand with self drawn returns true', () => {
                const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                    EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                    0, EAST_WIND, false, true, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                
                const result = CONCEALED_HAND_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
                
                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(true);
            });

            test('special hand without self drawn returns true', () => {
                const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                    EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                    0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                
                const result = CONCEALED_HAND_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
                
                expect(result.pointPredicateId).toBe(PointPredicateID.CONCEALED_HAND);
                expect(result.success).toBe(true);
            });
        });
    });

    describe('Fully Concealed Hand Predicate', () => {
        test('unexposed hand won via discard on pair returns false', () => {
            const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                new Pair(EIGHT_CIRCLE, true), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                new Pong(THREE_CHARACTER)], 
                1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = FULLY_CONCEALED_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_CONCEALED_HAND);
            expect(result.success).toBe(false);
            const concealed = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_CONCEALED) as PointPredicateFailureResult;
            expect(concealed.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SELF_DRAW)?.success).toBe(false);
        });

        test('unexposed hand won via self draw on pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                new Pong(THREE_CHARACTER)], 
                1, EIGHT_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = FULLY_CONCEALED_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_CONCEALED_HAND);
            expect(result.success).toBe(true);
            const concealed = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
            expect(concealed.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SELF_DRAW)?.success).toBe(true);
        });

        test('exposed hand won via self draw returns false', () => {
            const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER, true), 
                new Pong(THREE_CHARACTER)], 
                2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = FULLY_CONCEALED_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_CONCEALED_HAND);
            expect(result.success).toBe(false);
            const concealed = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
            expect(concealed.success).toBe(false);
            expect(result.getSubPredicateResult(PointPredicateID.SELF_DRAW)?.success).toBe(true);
        });

        test('unexposed hand won via self draw on non pair returns true', () => {
            const hand = new MeldBasedWinningHand([new Pong(SEVEN_CHARACTER), 
                new Pair(EIGHT_CIRCLE), new Pong(THREE_BAMBOO), new Pong(FIVE_CHARACTER), 
                new Pong(THREE_CHARACTER)], 
                2, THREE_BAMBOO, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]);

            const result = FULLY_CONCEALED_PREDICATE(hand, basicWinContext, basicRoundContext, rootConfig);

            expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_CONCEALED_HAND);
            expect(result.success).toBe(true);
            const concealed = result.getSubPredicateResult(PointPredicateID.SUBPREDICATE_ALL_MELDS_ARE_CONCEALED) as PointPredicateSingleSuccessResult;
            expect(concealed.success).toBe(true);
            expect(result.getSubPredicateResult(PointPredicateID.SELF_DRAW)?.success).toBe(true);
        });

        describe('special hand', () => {
            test('special hand with self drawn returns true', () => {
                const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                    EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                    0, EAST_WIND, false, true, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                
                const result = FULLY_CONCEALED_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
                
                expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_CONCEALED_HAND);
                expect(result.success).toBe(true);
            });

            test('special hand without self drawn returns false', () => {
                const specialHand = new SpecialWinningHand([[ONE_CHARACTER, NINE_CHARACTER, ONE_BAMBOO, NINE_BAMBOO, NINE_CIRCLE,
                    EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON], [ONE_CIRCLE, ONE_CIRCLE]], 
                    0, EAST_WIND, false, false, [], SpecialWinningHandType.THIRTEEN_ORPHANS);
                
                const result = FULLY_CONCEALED_PREDICATE(specialHand, basicWinContext, basicRoundContext, rootConfig);
                
                expect(result.pointPredicateId).toBe(PointPredicateID.FULLY_CONCEALED_HAND);
                expect(result.success).toBe(false);
            });
        });
    });
});
