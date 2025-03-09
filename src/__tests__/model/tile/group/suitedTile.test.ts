
import { isSuitedTileGroup } from "model/tile/group/suitedTile";
import { TileGroup } from "model/tile/tileGroup";

describe('suitedTile.ts', () => {
    describe('isSuitedTileGroup', () => {
        test('returns true for suited tile groups', () => {
            expect(isSuitedTileGroup(TileGroup.BAMBOO)).toBe(true);
            expect(isSuitedTileGroup(TileGroup.CHARACTER)).toBe(true);
            expect(isSuitedTileGroup(TileGroup.CIRCLE)).toBe(true);
        });

        test('returns false for non suited tile groups', () => {
            expect(isSuitedTileGroup(TileGroup.DRAGON)).toBe(false);
            expect(isSuitedTileGroup(TileGroup.WIND)).toBe(false);
            expect(isSuitedTileGroup(TileGroup.GENTLEMAN)).toBe(false);
            expect(isSuitedTileGroup(TileGroup.SEASON)).toBe(false);
        });
    });
});