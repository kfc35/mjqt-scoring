import { TileGroup } from "model/tile/tileGroup";
import { getHonorTileValues } from "model/tile/group/honorTile";
import { DragonTileValue, WindTileValue } from "model/tile/tileValue";

describe('honorTile.ts', () => {
    describe('getHonorTileValues', () => {
        test('returns dragonTileValues for Dragon tile group', () => {
            expect(getHonorTileValues(TileGroup.DRAGON)).toEqual(
                expect.arrayContaining([DragonTileValue.WHITE, DragonTileValue.GREEN, DragonTileValue.RED]));
            expect(getHonorTileValues(TileGroup.DRAGON).length).toBe(3);
        });

        test('returns windTileValues for Wind tile group', () => {
            expect(getHonorTileValues(TileGroup.WIND)).toEqual(
                expect.arrayContaining([WindTileValue.EAST, WindTileValue.SOUTH, WindTileValue.NORTH, WindTileValue.WEST]));
            expect(getHonorTileValues(TileGroup.WIND).length).toBe(4);
        });
    });
});