import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, NINE_CIRCLE, SOUTH_WIND, EAST_WIND,
    RED_DRAGON, PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON } from "common/deck";
import { SuitedTileValue } from "model/tile/tileValue";
import { SuitedTileValueQuantityMemo } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/suitedMeldsAnalyzer/suitedTileValueQuantityMemo";
import { TileGroup } from "model/tile/tileGroup";

describe('suitedTileValueQuantityMemo.ts', () => {
    describe('with a hand with suits and honor tiles', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                            SOUTH_WIND, SOUTH_WIND, SOUTH_WIND,
                            NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                            RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                            EAST_WIND, EAST_WIND,
                            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, false), []);

        test('has expected quantities per suited tile value for bamboos', () => {
            const quantityMemo = new SuitedTileValueQuantityMemo(hand, TileGroup.BAMBOO);

            expect(quantityMemo.getQuantity(SuitedTileValue.ONE)).toBe(1);
            expect(quantityMemo.getQuantity(SuitedTileValue.TWO)).toBe(1);
            expect(quantityMemo.getQuantity(SuitedTileValue.THREE)).toBe(1);
            expect(quantityMemo.getQuantity(SuitedTileValue.FOUR)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.FIVE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.SIX)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.SEVEN)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.EIGHT)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.NINE)).toBe(0);
        });

        test('has expected quantities per suited tile value for characters', () => {
            const quantityMemo = new SuitedTileValueQuantityMemo(hand, TileGroup.CHARACTER);

            expect(quantityMemo.getQuantity(SuitedTileValue.ONE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.TWO)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.THREE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.FOUR)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.FIVE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.SIX)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.SEVEN)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.EIGHT)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.NINE)).toBe(0);
        });

        test('has expected quantities per suited tile value for circles', () => {
            const quantityMemo = new SuitedTileValueQuantityMemo(hand, TileGroup.CIRCLE);

            expect(quantityMemo.getQuantity(SuitedTileValue.ONE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.TWO)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.THREE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.FOUR)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.FIVE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.SIX)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.SEVEN)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.EIGHT)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.NINE)).toBe(4);
        });

        test('throws when decrease too large of a number', () => {
            const quantityMemo = new SuitedTileValueQuantityMemo(hand, TileGroup.BAMBOO);
        
            expect(() => {quantityMemo.decreaseQuantity(SuitedTileValue.ONE, 2);}).toThrow();
            expect(() => {quantityMemo.decreaseQuantity(SuitedTileValue.FOUR, 1);}).toThrow();
        });
        
        test('throws when decrease negative number', () => {
            const quantityMemo = new SuitedTileValueQuantityMemo(hand, TileGroup.BAMBOO);
        
            expect(() => {quantityMemo.decreaseQuantity(SuitedTileValue.ONE, -1);}).toThrow();
        });

        test('successful decrease results in correct quantities', () => {
            const quantityMemo = new SuitedTileValueQuantityMemo(hand, TileGroup.BAMBOO);

            quantityMemo.decreaseQuantity(SuitedTileValue.ONE, 1);
            quantityMemo.decreaseQuantity(SuitedTileValue.TWO, 0);
            quantityMemo.decreaseQuantity(SuitedTileValue.THREE, 1);

            expect(quantityMemo.getQuantity(SuitedTileValue.ONE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.TWO)).toBe(1);
            expect(quantityMemo.getQuantity(SuitedTileValue.THREE)).toBe(0);
        });

        test('copies are completely distinct', () => {
            const quantityMemo = new SuitedTileValueQuantityMemo(hand, TileGroup.BAMBOO);
            const copyMemo = new SuitedTileValueQuantityMemo(quantityMemo);

            quantityMemo.decreaseQuantity(SuitedTileValue.ONE, 1);
            copyMemo.decreaseQuantity(SuitedTileValue.TWO, 1);
            quantityMemo.decreaseQuantity(SuitedTileValue.THREE, 1);

            expect(quantityMemo.getQuantity(SuitedTileValue.ONE)).toBe(0);
            expect(quantityMemo.getQuantity(SuitedTileValue.TWO)).toBe(1);
            expect(quantityMemo.getQuantity(SuitedTileValue.THREE)).toBe(0);

            expect(copyMemo.getQuantity(SuitedTileValue.ONE)).toBe(1);
            expect(copyMemo.getQuantity(SuitedTileValue.TWO)).toBe(0);
            expect(copyMemo.getQuantity(SuitedTileValue.THREE)).toBe(1);
        });
    });
});