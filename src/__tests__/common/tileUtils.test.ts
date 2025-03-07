import { tilesDoesNotContainTile } from "common/tileUtils"
import { ONE_BAMBOO, TWO_BAMBOO } from "common/deck";

describe('tileUtils.ts', () => {
    test('tilesDoesNotContainTile returns true when tile is not there', () => {
        expect(tilesDoesNotContainTile([ONE_BAMBOO], TWO_BAMBOO)).toBe(true);
    });

    test('tilesDoesNotContainTile returns false when tile is there', () => {
        expect(tilesDoesNotContainTile([ONE_BAMBOO], ONE_BAMBOO)).toBe(false);
    });
});