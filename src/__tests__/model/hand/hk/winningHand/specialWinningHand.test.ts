import { EAST_WIND, GREEN_DRAGON, NINE_BAMBOO, NINE_CHARACTER, NINE_CIRCLE, NORTH_WIND, 
    ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, PLUM_GENTLEMAN, RED_DRAGON, SOUTH_WIND, WEST_WIND, 
    WHITE_DRAGON, WINTER_SEASON } from "common/deck";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue } from "model/tile/tileValue";

describe('specialWinningHand.ts', () => {
    describe('constructor', () => {
        test('throws when tilesList is too small', () => {
            const tilesList = [[ONE_BAMBOO]];
            expect(() => {new SpecialWinningHand(tilesList, 0, ONE_BAMBOO, false, true, [], SpecialWinningHandType.CUSTOM);}).toThrow();
        });

        test('throws when tilesList is too big', () => {
            const tilesList = [[ONE_BAMBOO, NINE_BAMBOO, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE, 
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, WHITE_DRAGON], [GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON]];
            expect(() => {new SpecialWinningHand(tilesList, 1, GREEN_DRAGON, false, true, [], SpecialWinningHandType.CUSTOM);}).toThrow();
        });

        test('throws quantity per tile is exceeded for any tile in tiles', () => {
            const tilesList = [[ONE_BAMBOO, NINE_BAMBOO, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE, 
                EAST_WIND, SOUTH_WIND, WEST_WIND], [GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON, GREEN_DRAGON]];
            expect(() => {new SpecialWinningHand(tilesList, 1, GREEN_DRAGON, false, true, [], SpecialWinningHandType.CUSTOM);}).toThrow();
        });

        test('throws if the specified index of the winning tile in tiles is out of bounds', () => {
            const tilesList = [[ONE_BAMBOO, NINE_BAMBOO, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE, 
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, WHITE_DRAGON], [GREEN_DRAGON, GREEN_DRAGON]];
            expect(() => {new SpecialWinningHand(tilesList, 2, GREEN_DRAGON, false, true, [], SpecialWinningHandType.CUSTOM);}).toThrow();
        });

        test('throws if winning tile is not in the specified index of tiles', () => {
            const tilesList = [[ONE_BAMBOO, NINE_BAMBOO, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE, 
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, WHITE_DRAGON], [GREEN_DRAGON, GREEN_DRAGON]];
            expect(() => {new SpecialWinningHand(tilesList, 1, WHITE_DRAGON, false, true, [], SpecialWinningHandType.CUSTOM);}).toThrow();
            expect(() => {new SpecialWinningHand(tilesList, 0, GREEN_DRAGON, false, true, [], SpecialWinningHandType.CUSTOM);}).toThrow();
        });

        test('throws if flowers are not unique', () => {
            const tilesList = [[ONE_BAMBOO, NINE_BAMBOO, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE, 
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, WHITE_DRAGON], [GREEN_DRAGON, GREEN_DRAGON]];
            expect(() => {new SpecialWinningHand(tilesList, 1, GREEN_DRAGON, false, true, [PLUM_GENTLEMAN, PLUM_GENTLEMAN], SpecialWinningHandType.CUSTOM);}).toThrow();
        });

        test('tiles with winning tile index invalid throws', () => {
            const tilesList = [[ONE_BAMBOO, NINE_BAMBOO, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE, 
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, WHITE_DRAGON], [GREEN_DRAGON, GREEN_DRAGON]];
            const flowerTiles = [WINTER_SEASON];
            const winningTileIsPartOfPair = true;
            const isSelfDrawn = true;

            expect( () => {new SpecialWinningHand(
                tilesList, 3, GREEN_DRAGON, winningTileIsPartOfPair, isSelfDrawn, 
                flowerTiles, SpecialWinningHandType.THIRTEEN_ORPHANS);}).toThrow();
        });

        test('13 Orphans has correct fields set', () => {
            const tilesList = [[ONE_BAMBOO, NINE_BAMBOO, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE, 
                EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, RED_DRAGON, WHITE_DRAGON], [GREEN_DRAGON, GREEN_DRAGON]];
            const flowerTiles = [WINTER_SEASON];
            const winningTileIsPartOfPair = true;
            const isSelfDrawn = true;

            const winningHand = new SpecialWinningHand(
                tilesList, 1, GREEN_DRAGON, winningTileIsPartOfPair, isSelfDrawn, 
                flowerTiles, SpecialWinningHandType.THIRTEEN_ORPHANS);
            
            expect(winningHand.tiles).toStrictEqual([...tilesList.map((tiles) => [...tiles])]);
            expect(winningHand.tilesIndexWithWinningTile).toBe(1);
            expect(winningHand.winningTile).toStrictEqual(GREEN_DRAGON);
            expect(winningHand.winningTileIsPartOfPair).toBe(true);
            expect(winningHand.flowerTiles).toStrictEqual([WINTER_SEASON.clone()]);
            expect(winningHand.isSelfDrawn()).toBe(true);
            expect(winningHand.specialWinningHandType).toBe(SpecialWinningHandType.THIRTEEN_ORPHANS);

            const tgvm = winningHand.tileGroupValueMaps;
            expect(tgvm.getHonorTileGroups()).toStrictEqual(new Set([TileGroup.WIND, TileGroup.DRAGON]));
            expect(tgvm.getSuitedTileGroups()).toStrictEqual(new Set([TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]));
            expect(tgvm.getTilesForTileValues(new Set([SuitedTileValue.ONE]))).toStrictEqual([[ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE]]);
            expect(tgvm.getTilesForTileGroups(new Set([TileGroup.DRAGON]))).toStrictEqual([[RED_DRAGON, WHITE_DRAGON, GREEN_DRAGON, GREEN_DRAGON]]);
        });
    });
});