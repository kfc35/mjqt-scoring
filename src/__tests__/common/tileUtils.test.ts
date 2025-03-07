import { assertEachTileHasQuantityLTEMaxPerTile, assertTilesFlower, assertTilesHaveSameSuitedGroup, assertTilesHongKongTile, assertTilesNotNullAndCorrectLength, assertTilesSuitedOrHonor, assertTileSuitedOrHonor, partitionTilesByGroup, tilesDoesNotContainTile, tilesUnique } from "common/tileUtils"
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, EAST_WIND, FIVE_CHARACTER, ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, ORCHID_GENTLEMAN, PLUM_GENTLEMAN, RED_DRAGON, SPRING_SEASON, SUMMER_SEASON, THREE_CHARACTER, THREE_CIRCLE, TWO_BAMBOO, TWO_CHARACTER, TWO_CIRCLE, WEST_WIND, WHITE_DRAGON, WINTER_SEASON } from "common/deck";
import { BambooTile } from "model/tile/group/bambooTile";
import { SuitedTileValue } from "model/tile/tileValue";

describe('tileUtils.ts', () => {
    describe('assertTilesNotNullAndCorrectLength', () => {
        test('throws when tile is less than min length', () => {
            expect(() => {assertTilesNotNullAndCorrectLength([ONE_BAMBOO], 2, 3)})
                .toThrow('tiles must have length between 2 and 3');
        });

        test('throws when tile is more than max length', () => {
            expect(() => {assertTilesNotNullAndCorrectLength([ONE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO, TWO_CHARACTER], 1, 2)})
                .toThrow('tiles must have length between 1 and 2');
        });

        test('does nothing when tiles is equal to max length', () => {
            expect(assertTilesNotNullAndCorrectLength([ONE_BAMBOO, ONE_BAMBOO], 1, 2)).toBeUndefined();
        })

        test('does nothing when tiles is equal to min length', () => {
            expect(assertTilesNotNullAndCorrectLength([ONE_BAMBOO], 1, 2)).toBeUndefined();
        })
    });

    describe('assertTilesHaveSameSuitedGroup', () => {
        test('throws when tiles do not have the same suited group', () => {
            expect(() => {assertTilesHaveSameSuitedGroup([ONE_BAMBOO, ONE_CHARACTER])}).toThrow();
        });

        test('throws when tiles is empty', () => {
            expect(() => {assertTilesHaveSameSuitedGroup([])}).toThrow();
        });

        test('does nothing when tiles have the same suited group', () => {
            expect(assertTilesHaveSameSuitedGroup([ONE_BAMBOO, ONE_BAMBOO]))
                .toBeUndefined();
        });
    });

    describe('assertTilesSuitedOrHonor', () => {
        test('throws when there is a tile that is a gentleman tile', () => {
            expect(() => {assertTilesSuitedOrHonor([ONE_BAMBOO, ONE_CHARACTER, PLUM_GENTLEMAN, ONE_CIRCLE, RED_DRAGON, EAST_WIND])}).toThrow();
        });

        test('throws when there is a tile that is a season tile', () => {
            expect(() => {assertTilesSuitedOrHonor([ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON, EAST_WIND, SPRING_SEASON])}).toThrow();
        });

        test('returns true when tiles is empty', () => {
            expect(assertTilesSuitedOrHonor([])).toBe(true);
        });

        test('returns true when tiles are only suited or honor', () => {
            expect(assertTilesSuitedOrHonor([ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON, EAST_WIND])).toBe(true);
        });
    });

    describe('assertTileSuitedOrHonor', () => {
        test('throws when the tile is a gentleman tile', () => {
            expect(() => {assertTileSuitedOrHonor(PLUM_GENTLEMAN)}).toThrow();
        });

        test('throws when the tile is a season tile', () => {
            expect(() => {assertTileSuitedOrHonor(SPRING_SEASON)}).toThrow();
        });

        test('returns true when tile is suited', () => {
            expect(assertTileSuitedOrHonor(ONE_BAMBOO)).toBe(true);
        });

        test('returns true when tile is honor', () => {
            expect(assertTileSuitedOrHonor(RED_DRAGON)).toBe(true);
        });
    });

    describe('assertTilesFlower', () => {
        test('throws when there is a tile that is a bamboo tile', () => {
            expect(() => {assertTilesFlower([ONE_BAMBOO, PLUM_GENTLEMAN, SPRING_SEASON])}).toThrow();
        });

        test('throws when there is a tile that is a circle tile', () => {
            expect(() => {assertTilesFlower([BAMBOO_GENTLEMAN, TWO_CIRCLE, AUTUMN_SEASON])}).toThrow();
        });

        test('throws when there is a tile that is a character tile', () => {
            expect(() => {assertTilesFlower([CHRYSANTHEMUM_GENTLEMAN, SUMMER_SEASON, THREE_CHARACTER])}).toThrow();
        });

        test('returns true when tiles is empty', () => {
            expect(assertTilesFlower([])).toBe(true);
        });

        test('returns true when tiles are only flowers', () => {
            expect(assertTilesFlower([WINTER_SEASON, ORCHID_GENTLEMAN])).toBe(true);
        });
    });

    describe('assertTilesHongKong', () => {
        test('returns true when tiles are empty', () => {
            expect(assertTilesHongKongTile([])).toBe(true);
        });

        test('returns true when tile are hk tiles', () => {
            expect(assertTilesHongKongTile([ONE_BAMBOO, SPRING_SEASON, ONE_CHARACTER, ONE_CIRCLE, BAMBOO_GENTLEMAN, RED_DRAGON, EAST_WIND])).toBe(true);
        });
    });

    describe('tilesDoesNotContainTile', () => {
        test('returns true when tile is not there', () => {
            expect(tilesDoesNotContainTile([ONE_BAMBOO], TWO_BAMBOO)).toBe(true);
        });
    
        test('returns false when tile is there', () => {
            expect(tilesDoesNotContainTile([ONE_BAMBOO], ONE_BAMBOO)).toBe(false);
        });
    });
    
    describe('tilesUnique', () => {
        test('returns false when there is a duplicate', () => {
            expect(tilesUnique([ONE_BAMBOO, ONE_CHARACTER, TWO_BAMBOO, TWO_CHARACTER, new BambooTile(SuitedTileValue.ONE)]))
                .toBe(false);
        });
    
        test('returns true when tile is empty', () => {
            expect(tilesUnique([])).toBe(true);
        });
    
        test('returns true when there are no duplicates', () => {
            expect(tilesUnique([ONE_BAMBOO, ONE_CHARACTER, TWO_BAMBOO, TWO_CHARACTER])).toBe(true);
        });
    });

    describe('assertEachTileHasQuantityLTEMaxPerTile', () => {
        test('does nothing when there are no tiles', () => {
            expect(assertEachTileHasQuantityLTEMaxPerTile([])).toBeUndefined();
        });
    
        test('does nothing when tiles are all LTE max per tile', () => {
            expect(assertEachTileHasQuantityLTEMaxPerTile([ONE_BAMBOO, TWO_CHARACTER, TWO_CHARACTER, 
                THREE_CIRCLE, THREE_CIRCLE, THREE_CIRCLE, RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON])).toBeUndefined();
        });
    
        test('throws when a tile exceeds LTE max per tile', () => {
            expect(() => {assertEachTileHasQuantityLTEMaxPerTile([ONE_BAMBOO, 
                FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER, 
                THREE_CIRCLE, THREE_CIRCLE, THREE_CIRCLE, RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON])}).toThrow();
        });
    });

    describe('partitionTilesByGroup', () => {
        test('returns [] when tiles is empty', () => {
            expect(partitionTilesByGroup([])).toStrictEqual([]);
        });

        test('returns tiles separated by group', () => {
            expect(partitionTilesByGroup([ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, 
                TWO_BAMBOO, TWO_CHARACTER, TWO_CIRCLE, 
                RED_DRAGON, EAST_WIND, WHITE_DRAGON, WEST_WIND,
                PLUM_GENTLEMAN, SPRING_SEASON, BAMBOO_GENTLEMAN, WINTER_SEASON])).toStrictEqual([
                    [ONE_BAMBOO, TWO_BAMBOO], [ONE_CHARACTER, TWO_CHARACTER], [ONE_CIRCLE, TWO_CIRCLE],
                    [RED_DRAGON, WHITE_DRAGON], [EAST_WIND, WEST_WIND], 
                    [BAMBOO_GENTLEMAN, PLUM_GENTLEMAN],
                    [SPRING_SEASON, WINTER_SEASON]
                ]);
        });
    });
});
