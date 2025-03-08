import { BAMBOO_GENTLEMAN, FIVE_CIRCLE, FOUR_CIRCLE, NORTH_WIND, ONE_BAMBOO, ORCHID_GENTLEMAN, RED_DRAGON, 
    SIX_CIRCLE, SOUTH_WIND, SUMMER_SEASON, THREE_CHARACTER, TWO_CHARACTER, WEST_WIND, WHITE_DRAGON } from "common/deck";
import { TileToQuantityMap } from "model/tile/quantityMap/tileQuantityMap";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue } from "model/tile/tileValue";

describe('tileQuantityMap.ts', () => {
    test('empty tiles returns empty map', () => {
            const tqm = new TileToQuantityMap([]);

            expect(tqm.getTotalQuantity(true)).toBe(0);
    });

    test('with tiles from every group has correct fields set', () => {
        const tqm = new TileToQuantityMap([ONE_BAMBOO, TWO_CHARACTER, TWO_CHARACTER, 
            FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE, SIX_CIRCLE, RED_DRAGON, WHITE_DRAGON, 
            WEST_WIND, NORTH_WIND, SOUTH_WIND, BAMBOO_GENTLEMAN, ORCHID_GENTLEMAN, SUMMER_SEASON]);

        expect(tqm.getTotalQuantity(true)).toBe(15);
        expect(tqm.getTotalQuantity(false)).toBe(12);
        expect(tqm.getQuantity(TWO_CHARACTER)).toBe(2);
        expect(tqm.getQuantity(THREE_CHARACTER)).toBe(0);
        const expectedCircleMap = new Map();
        expectedCircleMap.set(SuitedTileValue.FOUR, 1);
        expectedCircleMap.set(SuitedTileValue.FIVE, 1);
        expectedCircleMap.set(SuitedTileValue.SIX, 2);
        expect(tqm.getQuantitiesForTileGroup(TileGroup.CIRCLE)).toStrictEqual(expectedCircleMap);
        // 11 tiles have quantity = 1
        expect(tqm.getQuantityPerUniqueTile(true).filter(quantity => quantity === 1).length).toBe(11);
        expect(tqm.getQuantityPerUniqueTile(true).filter(quantity => quantity === 2).length).toBe(2);
        expect(tqm.getQuantityPerUniqueTile(false).filter(quantity => quantity === 1).length).toBe(8);
        expect(tqm.getQuantityPerUniqueTile(false).filter(quantity => quantity === 2).length).toBe(2);

        const nzqtm = tqm.getNonZeroQuantityToTileMap(true);
        expect(nzqtm.get(1)).toEqual(expect.arrayContaining([ONE_BAMBOO, FOUR_CIRCLE, 
            FIVE_CIRCLE, RED_DRAGON, WHITE_DRAGON, WEST_WIND, NORTH_WIND, SOUTH_WIND,
            BAMBOO_GENTLEMAN, ORCHID_GENTLEMAN, SUMMER_SEASON
        ]));
        expect((nzqtm.get(1) ?? []).length).toBe(11);
        expect(nzqtm.get(2)).toEqual(expect.arrayContaining([TWO_CHARACTER, SIX_CIRCLE]));
        expect((nzqtm.get(2) ?? []).length).toBe(2);
        expect(nzqtm.get(0)).toBeUndefined();
        expect(nzqtm.get(3)).toBeUndefined();
        expect(nzqtm.get(4)).toBeUndefined();
    });
});