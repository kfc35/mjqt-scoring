import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { Pair } from "model/meld/pair";
import { SEVEN_CHARACTER, EIGHT_CIRCLE, NORTH_WIND, TWO_CHARACTER, THREE_CHARACTER,
    ONE_CHARACTER, FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE, AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN
 } from "common/deck";
import { ifLastTileWasDiscardThenItCompletedPairSubPredicate, ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate, lastTileCompletedPairSubPredicate } from "service/point/predicate/impl/hand/lastTileSubPredicate";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { Chow } from "model/meld/chow";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import type { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";

describe('lastTileSubPredicate.ts', () => {
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('ifLastTileWasDiscardThenItCompletedPairSubPredicate', () => {
        test('returns true if last tile is self drawn and does not complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                4, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = ifLastTileWasDiscardThenItCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR);
            expect(result.success).toBe(true);
        });

        test('returns true if last tile is self drawn and does complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER]), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                0, SEVEN_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = ifLastTileWasDiscardThenItCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR);
            expect(result.success).toBe(true);
        });

        test('returns true if last tile is discard and does complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER, true), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                0, SEVEN_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = ifLastTileWasDiscardThenItCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR);
            expect(result.success).toBe(true);
        });

        test('returns false if last tile is discard and does not complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER, true), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                3, ONE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = ifLastTileWasDiscardThenItCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR);
            expect(result.success).toBe(false);
            const failure = result as PointPredicateFailureResult;
            expect(failure.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([3]));
        });
    });

    describe('ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate', () => {
        test('returns false if last tile is self drawn and does not complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                4, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR);
            expect(result.success).toBe(false);
            const failure = result as PointPredicateFailureResult;
            expect(failure.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([4]));
        });

        test('returns true if last tile is self drawn and does complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER]), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                0, SEVEN_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR);
            expect(result.success).toBe(true);
        });

        test('returns true if last tile is discard and does complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER, true), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                0, SEVEN_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR);
            expect(result.success).toBe(true);
        });

        test('returns false if last tile is discard and does not complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER, true), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                3, ONE_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = ifLastTileWasSelfDrawnThenItCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR);
            expect(result.success).toBe(true);
        });
    });

    describe('lastTileCompletedPairSubPredicate', () => {
        test('returns false if last tile does not complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER, true), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                4, FOUR_CIRCLE, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = lastTileCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_LAST_TILE_COMPLETED_PAIR);
            expect(result.success).toBe(false);
            const failure = result as PointPredicateFailureResult;
            expect(failure.meldDetail?.meldIndicesThatFailPredicate).toStrictEqual(new Set([4]));
        });


        test('returns true if last tile is does complete pair', () => {
            const meldHand = new MeldBasedWinningHand([new Pair(SEVEN_CHARACTER, true), new Pong(EIGHT_CIRCLE, true),
                new Kong(NORTH_WIND), new Chow([ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER], true), new Chow([FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE])], 
                0, SEVEN_CHARACTER, [AUTUMN_SEASON, CHRYSANTHEMUM_GENTLEMAN]);

            const result = lastTileCompletedPairSubPredicate(meldHand, basicWinContext, basicRoundContext, rootConfig);
            
            expect(result.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_LAST_TILE_COMPLETED_PAIR);
            expect(result.success).toBe(true);
        });
    });
});