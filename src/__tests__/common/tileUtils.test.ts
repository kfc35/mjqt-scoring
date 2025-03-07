import { assertTilesHaveSameSuitedGroup, assertTilesNotNullAndCorrectLength, tilesDoesNotContainTile, tilesUnique } from "common/tileUtils"
import { ONE_BAMBOO, ONE_CHARACTER, TWO_BAMBOO, TWO_CHARACTER } from "common/deck";
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
});
