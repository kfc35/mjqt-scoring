import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, NINE_CIRCLE, SOUTH_WIND, EAST_WIND,
    RED_DRAGON, PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON } from "common/deck";
import { HonorTileValueQuantityMemo } from "service/handAnalyzer/base/standardWinningHandAnalyzer/meldsAnalyzer/honorMeldsAnalyzer/honorTileValueQuantityMemo";
import { DragonTileValue, WindTileValue } from "model/tile/tileValue";

describe('honorTileValueQuantityMemo.ts', () => {
    describe('with a hand with suits and honor tiles', () => {
        const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                            SOUTH_WIND, SOUTH_WIND, SOUTH_WIND,
                            NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                            RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                            EAST_WIND, EAST_WIND,
                            PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, false), []);

        test('has expected quantities per honor tile', () => {
            const quantityMemo = new HonorTileValueQuantityMemo(hand);

            expect(quantityMemo.getQuantity(DragonTileValue.RED)).toBe(4);
            expect(quantityMemo.getQuantity(DragonTileValue.GREEN)).toBe(0);
            expect(quantityMemo.getQuantity(DragonTileValue.WHITE)).toBe(0);
            expect(quantityMemo.getQuantity(WindTileValue.SOUTH)).toBe(3);
            expect(quantityMemo.getQuantity(WindTileValue.EAST)).toBe(2);
            expect(quantityMemo.getQuantity(WindTileValue.NORTH)).toBe(0);
            expect(quantityMemo.getQuantity(WindTileValue.WEST)).toBe(0);
        });

        test('throws when decrease too large of a number', () => {
            const quantityMemo = new HonorTileValueQuantityMemo(hand);

            expect(() => {quantityMemo.decreaseQuantity(DragonTileValue.RED, 5);}).toThrow();
            expect(() => {quantityMemo.decreaseQuantity(WindTileValue.SOUTH, 4);}).toThrow();
            expect(() => {quantityMemo.decreaseQuantity(WindTileValue.EAST, 3);}).toThrow();
            expect(() => {quantityMemo.decreaseQuantity(WindTileValue.NORTH, 1);}).toThrow();
        });

        test('throws when decrease negative number', () => {
            const quantityMemo = new HonorTileValueQuantityMemo(hand);

            expect(() => {quantityMemo.decreaseQuantity(DragonTileValue.RED, -1);}).toThrow();
        });

        test('successful decrease results in correct quantities', () => {
            const quantityMemo = new HonorTileValueQuantityMemo(hand);

            quantityMemo.decreaseQuantity(DragonTileValue.RED, 4);
            quantityMemo.decreaseQuantity(WindTileValue.SOUTH, 1);
            quantityMemo.decreaseQuantity(WindTileValue.EAST, 0);

            expect(quantityMemo.getQuantity(DragonTileValue.RED)).toBe(0);
            expect(quantityMemo.getQuantity(WindTileValue.SOUTH)).toBe(2);
            expect(quantityMemo.getQuantity(WindTileValue.EAST)).toBe(2);
        });
    });
});