import { Pair } from "model/meld/pair";
import { Chow } from "model/meld/chow";
import { Pong } from "model/meld/pong";
import { Kong } from "model/meld/kong";
import { Meld } from "model/meld/meld";
import { MeldBasedWinningHandTileGroupValueMaps, SpecialWinningHandTileGroupValueMaps } from "model/hand/hk/winningHand/tileGroupValueMaps";
import { EAST_WIND, EIGHT_CIRCLE, FIVE_BAMBOO, FOUR_BAMBOO, SEVEN_BAMBOO, SEVEN_CHARACTER, SIX_BAMBOO, SIX_CIRCLE, THREE_CHARACTER, TWO_CIRCLE, WEST_WIND } from "common/deck";
import { TileGroup } from "model/tile/tileGroup";
import { DragonTileValue, SuitedTileValue, WindTileValue } from "model/tile/tileValue";
import type { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";

describe('tileGroupValueMaps.ts', () => {
    describe('MeldBasedWinningHandTileGroupValueMaps', () => {
        const melds: Meld[] = [
            new Pair(WEST_WIND), 
            new Chow([FIVE_BAMBOO, SIX_CIRCLE, SEVEN_CHARACTER]),
            new Kong(EAST_WIND, true),
            new Chow([FIVE_BAMBOO, SIX_BAMBOO, SEVEN_BAMBOO]),
            new Pong(EIGHT_CIRCLE),
            new Chow([TWO_CIRCLE, FOUR_BAMBOO, THREE_CHARACTER]),
        ];

        const maps = new MeldBasedWinningHandTileGroupValueMaps(melds);

        test('has class-specific fields set as expected', () => {

            expect(maps.getKnittedChowIndices()).toStrictEqual(new Set([1, 5]));

            expect(maps.getTilesFromKnittedChows(TileGroup.BAMBOO)).toStrictEqual([FIVE_BAMBOO,FOUR_BAMBOO]);
            expect(maps.getTilesFromKnittedChows(TileGroup.CIRCLE)).toStrictEqual([SIX_CIRCLE,TWO_CIRCLE]);
            expect(maps.getTilesFromKnittedChows(TileGroup.CHARACTER)).toStrictEqual([SEVEN_CHARACTER,THREE_CHARACTER]);

            expect(maps.getNonKnittedMeldIndicesForSuitedTileGroup(TileGroup.BAMBOO)).toStrictEqual(new Set([3]));
            expect(maps.getNonKnittedMeldIndicesForSuitedTileGroup(TileGroup.CIRCLE)).toStrictEqual(new Set([4]));
            expect(maps.getNonKnittedMeldIndicesForSuitedTileGroup(TileGroup.CHARACTER)).toStrictEqual(new Set());

            expect(maps.getMeldIndicesForSuitedTileGroup(TileGroup.BAMBOO)).toStrictEqual(new Set([1, 3, 5]));
            expect(maps.getMeldIndicesForSuitedTileGroup(TileGroup.CIRCLE)).toStrictEqual(new Set([1, 4, 5]));
            expect(maps.getMeldIndicesForSuitedTileGroup(TileGroup.CHARACTER)).toStrictEqual(new Set([1, 5]));

            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.ONE)).toStrictEqual(new Set());
            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.TWO)).toStrictEqual(new Set([5]));
            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.THREE)).toStrictEqual(new Set([5]));
            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.FOUR)).toStrictEqual(new Set([5]));
            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.FIVE)).toStrictEqual(new Set([1, 3]));
            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.SIX)).toStrictEqual(new Set([1, 3]));
            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.SEVEN)).toStrictEqual(new Set([1, 3]));
            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.EIGHT)).toStrictEqual(new Set([4]));
            expect(maps.getMeldIndicesForSuitedTileValue(SuitedTileValue.NINE)).toStrictEqual(new Set([]));

            expect(maps.getMeldIndicesForHonorTileGroup(TileGroup.DRAGON)).toStrictEqual(new Set());
            expect(maps.getMeldIndicesForHonorTileGroup(TileGroup.WIND)).toStrictEqual(new Set([0, 2]));
            expect(maps.getMeldIndicesForHonorTileValue(DragonTileValue.GREEN)).toStrictEqual(new Set());
            expect(maps.getMeldIndicesForHonorTileValue(DragonTileValue.RED)).toStrictEqual(new Set());
            expect(maps.getMeldIndicesForHonorTileValue(DragonTileValue.WHITE)).toStrictEqual(new Set());
            expect(maps.getMeldIndicesForHonorTileValue(WindTileValue.EAST)).toStrictEqual(new Set([2]));
            expect(maps.getMeldIndicesForHonorTileValue(WindTileValue.SOUTH)).toStrictEqual(new Set());
            expect(maps.getMeldIndicesForHonorTileValue(WindTileValue.WEST)).toStrictEqual(new Set([0]));
            expect(maps.getMeldIndicesForHonorTileValue(WindTileValue.NORTH)).toStrictEqual(new Set());
        });

        test('has interface fields set as expected', () => {
            expect(maps.getSuitedTileGroups()).toStrictEqual(new Set([TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]));
            expect(maps.getSuitedTileValues()).toStrictEqual(new Set([SuitedTileValue.TWO, SuitedTileValue.THREE, SuitedTileValue.FOUR, 
                SuitedTileValue.FIVE, SuitedTileValue.SIX, SuitedTileValue.SEVEN, SuitedTileValue.EIGHT]))
            expect(maps.getHonorTileGroups()).toStrictEqual(new Set([TileGroup.WIND]));
            expect(maps.getHonorTileValues()).toStrictEqual(new Set([WindTileValue.EAST, WindTileValue.WEST]));

            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.ONE)).toStrictEqual([]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.TWO)).toStrictEqual([TWO_CIRCLE]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.THREE)).toStrictEqual([THREE_CHARACTER]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.FOUR)).toStrictEqual([FOUR_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.FIVE)).toStrictEqual([FIVE_BAMBOO, FIVE_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.SIX)).toStrictEqual([SIX_CIRCLE, SIX_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.SEVEN)).toStrictEqual([SEVEN_CHARACTER, SEVEN_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.EIGHT)).toStrictEqual([EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.NINE)).toStrictEqual([]);

            expect(maps.getTilesForTileGroups(new Set([TileGroup.BAMBOO, TileGroup.CHARACTER])))
            .toStrictEqual(([[FIVE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO, SEVEN_BAMBOO], 
                [SEVEN_CHARACTER, THREE_CHARACTER]]));

            expect(maps.getTilesForTileGroups(new Set([TileGroup.WIND, TileGroup.CIRCLE])))
            .toStrictEqual([[WEST_WIND, WEST_WIND, EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND],
                [SIX_CIRCLE, TWO_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE]
            ]);
                
            expect(maps.getTilesForTileValues(new Set([WindTileValue.EAST, SuitedTileValue.NINE, SuitedTileValue.FIVE])))
            .toStrictEqual([[EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND], [], [FIVE_BAMBOO, FIVE_BAMBOO]]);

            expect(maps.getTilesForTileValues(new Set([SuitedTileValue.ONE]))).toStrictEqual([[]]);
            expect(maps.getTilesForTileValues(new Set([SuitedTileValue.SIX, SuitedTileValue.EIGHT])))
            .toStrictEqual([[SIX_CIRCLE, SIX_BAMBOO], [EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE]]);
        });
    });

    describe('SpecialWinningHandTileGroupValueMaps', () => {
        const tiles: SuitedOrHonorTile[][] = [
            [WEST_WIND, WEST_WIND], 
            [FIVE_BAMBOO, SIX_CIRCLE, SEVEN_CHARACTER],
            [EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND],
            [FIVE_BAMBOO, SIX_BAMBOO, SEVEN_BAMBOO],
            [EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE],
            [TWO_CIRCLE, FOUR_BAMBOO, THREE_CHARACTER]
        ];

        const maps = new SpecialWinningHandTileGroupValueMaps(tiles);

        test('has class-specific fields set as expected', () => {

            expect(maps.getTilesForSuitedTileGroup(TileGroup.BAMBOO)).toStrictEqual([FIVE_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO, SEVEN_BAMBOO, FOUR_BAMBOO]);
            expect(maps.getTilesForSuitedTileGroup(TileGroup.CHARACTER)).toStrictEqual([SEVEN_CHARACTER, THREE_CHARACTER]);
            expect(maps.getTilesForSuitedTileGroup(TileGroup.CIRCLE)).toStrictEqual([SIX_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE, TWO_CIRCLE]);
            expect(maps.getTilesForHonorTileGroup(TileGroup.WIND)).toStrictEqual([WEST_WIND, WEST_WIND, EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND]);
            expect(maps.getTilesForHonorTileGroup(TileGroup.DRAGON)).toStrictEqual([]);

            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.ONE)).toStrictEqual([]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.TWO)).toStrictEqual([TWO_CIRCLE]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.THREE)).toStrictEqual([THREE_CHARACTER]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.FOUR)).toStrictEqual([FOUR_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.FIVE)).toStrictEqual([FIVE_BAMBOO, FIVE_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.SIX)).toStrictEqual([SIX_CIRCLE, SIX_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.SEVEN)).toStrictEqual([SEVEN_CHARACTER, SEVEN_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.EIGHT)).toStrictEqual([EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.NINE)).toStrictEqual([]);

            expect(maps.getTilesForHonorTileValue(DragonTileValue.GREEN)).toStrictEqual([]);
            expect(maps.getTilesForHonorTileValue(DragonTileValue.RED)).toStrictEqual([]);
            expect(maps.getTilesForHonorTileValue(DragonTileValue.WHITE)).toStrictEqual([]);
            expect(maps.getTilesForHonorTileValue(WindTileValue.EAST)).toStrictEqual([EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND]);
            expect(maps.getTilesForHonorTileValue(WindTileValue.SOUTH)).toStrictEqual([]);
            expect(maps.getTilesForHonorTileValue(WindTileValue.WEST)).toStrictEqual([WEST_WIND, WEST_WIND]);
            expect(maps.getTilesForHonorTileValue(WindTileValue.NORTH)).toStrictEqual([]);
        });

        test('has interface fields set as expected', () => {
            expect(maps.getSuitedTileGroups()).toStrictEqual(new Set([TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]));
            expect(maps.getSuitedTileValues()).toStrictEqual(new Set([SuitedTileValue.TWO, SuitedTileValue.THREE, SuitedTileValue.FOUR, 
                SuitedTileValue.FIVE, SuitedTileValue.SIX, SuitedTileValue.SEVEN, SuitedTileValue.EIGHT]))
            expect(maps.getHonorTileGroups()).toStrictEqual(new Set([TileGroup.WIND]));
            expect(maps.getHonorTileValues()).toStrictEqual(new Set([WindTileValue.EAST, WindTileValue.WEST]));

            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.ONE)).toStrictEqual([]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.TWO)).toStrictEqual([TWO_CIRCLE]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.THREE)).toStrictEqual([THREE_CHARACTER]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.FOUR)).toStrictEqual([FOUR_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.FIVE)).toStrictEqual([FIVE_BAMBOO, FIVE_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.SIX)).toStrictEqual([SIX_CIRCLE, SIX_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.SEVEN)).toStrictEqual([SEVEN_CHARACTER, SEVEN_BAMBOO]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.EIGHT)).toStrictEqual([EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE]);
            expect(maps.getTilesForSuitedTileValue(SuitedTileValue.NINE)).toStrictEqual([]);

            expect(maps.getTilesForTileGroups(new Set([TileGroup.BAMBOO, TileGroup.CHARACTER])))
            .toStrictEqual([[FIVE_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO, SEVEN_BAMBOO, FOUR_BAMBOO], 
                [SEVEN_CHARACTER, THREE_CHARACTER]]);

            expect(maps.getTilesForTileGroups(new Set([TileGroup.WIND, TileGroup.CIRCLE])))
            .toStrictEqual([[WEST_WIND, WEST_WIND, EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND],
                [SIX_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE, TWO_CIRCLE]
            ]);
                
            expect(maps.getTilesForTileValues(new Set([WindTileValue.EAST, SuitedTileValue.NINE, SuitedTileValue.FIVE])))
            .toStrictEqual([[EAST_WIND, EAST_WIND, EAST_WIND, EAST_WIND], [], [FIVE_BAMBOO, FIVE_BAMBOO]]);

            expect(maps.getTilesForTileValues(new Set([SuitedTileValue.ONE]))).toStrictEqual([[]]);
            expect(maps.getTilesForTileValues(new Set([SuitedTileValue.SIX, SuitedTileValue.EIGHT])))
            .toStrictEqual([[SIX_CIRCLE, SIX_BAMBOO], [EIGHT_CIRCLE, EIGHT_CIRCLE, EIGHT_CIRCLE]]);
        });
    });
});