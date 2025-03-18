import { Pair } from "model/meld/pair";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, EIGHT_BAMBOO, FIVE_BAMBOO, 
    FIVE_CHARACTER, FOUR_BAMBOO, FOUR_CHARACTER, NINE_CHARACTER, 
    ONE_BAMBOO, ORCHID_GENTLEMAN, RED_DRAGON, SEVEN_BAMBOO, SIX_BAMBOO, SUMMER_SEASON, 
    THREE_BAMBOO, THREE_CHARACTER, TWO_BAMBOO,TWO_CIRCLE} from "common/deck";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { Chow } from "model/meld/chow";
import { Kong } from "model/meld/kong";
import { Pong } from "model/meld/pong";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue } from "model/tile/tileValue";

describe('meldBasedWinningHand.ts', () => {
    describe('constructor', () => {
        test('throws when meldList is too small', () => {
            const meldList = [new Pair(ONE_BAMBOO)];
            expect(() => {new MeldBasedWinningHand(meldList, 0, ONE_BAMBOO, []);}).toThrow();
        });

        test('throws when meldList is too big', () => {
            const meldList = [new Pair(ONE_BAMBOO), new Pair(TWO_BAMBOO), new Pair(THREE_BAMBOO),
                new Pair(FOUR_BAMBOO), new Pair(FIVE_BAMBOO), new Pair(SIX_BAMBOO), new Pair(SEVEN_BAMBOO),
                new Pair(EIGHT_BAMBOO)
            ];
            expect(() => {new MeldBasedWinningHand(meldList, 0, ONE_BAMBOO, []);}).toThrow();
        });

        test('throws when meldList of size five has more than one pair', () => {
            const meldList = [new Pair(ONE_BAMBOO), new Pong(FIVE_CHARACTER, true), 
                new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], false),
                new Pong(RED_DRAGON, false), new Pair(TWO_BAMBOO)
            ];
            expect(() => {new MeldBasedWinningHand(meldList, 0, ONE_BAMBOO, []);}).toThrow();
        });
        
        test('throws when flowers are not unique', () => {
            const meldList = [new Pair(ONE_BAMBOO, false), new Kong(RED_DRAGON, true),
                 new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true), 
                 new Pong(FIVE_CHARACTER, false), new Pong(NINE_CHARACTER, true)]
            const flowerTiles = [ORCHID_GENTLEMAN, SUMMER_SEASON, ORCHID_GENTLEMAN];

            expect(() => {new MeldBasedWinningHand(meldList, 2, FIVE_CHARACTER, flowerTiles);}).toThrow();
        });

        test('throws when tiles has one tile that exceeds max quantity in deck', () => {
            const meldList = [new Pair(RED_DRAGON, false), new Kong(RED_DRAGON, true),
                 new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true), 
                 new Pong(FIVE_CHARACTER, false), new Pong(NINE_CHARACTER, true)]
            const flowerTiles = [ORCHID_GENTLEMAN, SUMMER_SEASON];

            expect(() => {new MeldBasedWinningHand(meldList, 2, FIVE_CHARACTER, flowerTiles);}).toThrow();
        });

        test('throws when meld with winning tile at index provided does not contain winning tile', () => {
            const meldList = [new Pair(ONE_BAMBOO, false), new Kong(RED_DRAGON, true),
                 new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true), 
                 new Pong(FIVE_CHARACTER, false), new Pong(NINE_CHARACTER, true)]
            const flowerTiles = [ORCHID_GENTLEMAN, SUMMER_SEASON];

            expect(() => {new MeldBasedWinningHand(meldList, 2, NINE_CHARACTER, flowerTiles);}).toThrow();
        });

        test('throws when meld with winning tile at index provided does is a kong', () => {
            const meldList = [new Pair(ONE_BAMBOO, false), new Kong(RED_DRAGON, true),
                 new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true), 
                 new Pong(FIVE_CHARACTER, false), new Pong(NINE_CHARACTER, true)]
            const flowerTiles = [ORCHID_GENTLEMAN, SUMMER_SEASON];

            expect(() => {new MeldBasedWinningHand(meldList, 1, RED_DRAGON, flowerTiles);}).toThrow();
        });

        test('throws when 7 pairs winning hand has more than one exposed pair', () => {
            const meldList = [new Pair(ONE_BAMBOO), new Pair(TWO_BAMBOO), new Pair(THREE_BAMBOO, true),
                new Pair(FOUR_BAMBOO, true), new Pair(FIVE_BAMBOO), new Pair(SIX_BAMBOO), new Pair(SEVEN_BAMBOO)
            ];
            const flowerTiles = [SUMMER_SEASON, AUTUMN_SEASON];

            expect(() => {new MeldBasedWinningHand(meldList, 2, THREE_BAMBOO, flowerTiles);}).toThrow();
        });

        test('valid 7 pairs winning hand has correct fields set', () => {
            const meldList = [new Pair(ONE_BAMBOO), new Pair(TWO_BAMBOO), new Pair(THREE_BAMBOO, true),
                new Pair(FOUR_BAMBOO), new Pair(FIVE_BAMBOO), new Pair(SIX_BAMBOO), new Pair(SEVEN_BAMBOO)
            ];
            const flowerTiles = [SUMMER_SEASON, AUTUMN_SEASON];

            const winningHand = new MeldBasedWinningHand(meldList, 2, THREE_BAMBOO, flowerTiles);

            expect(winningHand.tiles).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO], [TWO_BAMBOO, TWO_BAMBOO], 
                [THREE_BAMBOO, THREE_BAMBOO], [FOUR_BAMBOO, FOUR_BAMBOO], [FIVE_BAMBOO, FIVE_BAMBOO], 
                [SIX_BAMBOO, SIX_BAMBOO], [SEVEN_BAMBOO, SEVEN_BAMBOO], 
            ]);
            expect(winningHand.melds).toStrictEqual(meldList);
            expect(winningHand.tilesIndexWithWinningTile).toBe(2);
            expect(winningHand.meldWithWinningTile).toStrictEqual(new Pair(THREE_BAMBOO, true));
            expect(winningHand.meldWithWinningTileIndex).toStrictEqual(2);
            expect(winningHand.winningTile).toStrictEqual(THREE_BAMBOO);
            expect(winningHand.winningTileIsPartOfPair).toBe(true);
            expect(winningHand.flowerTiles).toStrictEqual([SUMMER_SEASON.clone(), AUTUMN_SEASON.clone()]);
            expect(winningHand.isSelfDrawn()).toBe(false);

            const tgvm = winningHand.tileGroupValueMaps;
            expect(tgvm.getHonorTileGroups()).toStrictEqual(new Set());
            expect(tgvm.getSuitedTileGroups()).toStrictEqual(new Set([TileGroup.BAMBOO]));
            expect(tgvm.getTilesForTileValues(new Set([SuitedTileValue.ONE]))).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO]]);
            expect(tgvm.getTilesForTileGroups(new Set([TileGroup.DRAGON]))).toStrictEqual([[]]);
        });

        test('valid 5 melds based winning hand with invalid winning meld index throws', () => {
            const meldList = [new Pair(ONE_BAMBOO, false), new Pong(RED_DRAGON, true),
                 new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true), 
                 new Pong(FIVE_CHARACTER, false), 
                 new Pong(NINE_CHARACTER, true)]
            const flowerTiles = [ORCHID_GENTLEMAN, BAMBOO_GENTLEMAN];

            expect(() => {new MeldBasedWinningHand(meldList, 5, NINE_CHARACTER, flowerTiles);}).toThrow();
        });

        test('valid 5 melds based winning hand with min length has correct fields set', () => {
            const meldList = [new Pair(ONE_BAMBOO, false), new Pong(RED_DRAGON, true),
                 new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true), 
                 new Pong(FIVE_CHARACTER, false), 
                 new Pong(NINE_CHARACTER, true)]
            const flowerTiles = [ORCHID_GENTLEMAN, BAMBOO_GENTLEMAN];

            const winningHand = new MeldBasedWinningHand(meldList, 2, FIVE_CHARACTER, flowerTiles);
            
            expect(winningHand.tiles).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO], [RED_DRAGON, RED_DRAGON, RED_DRAGON], 
                [THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], [FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER],
                [NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER]
            ]);
            expect(winningHand.melds).toStrictEqual(meldList);
            expect(winningHand.tilesIndexWithWinningTile).toBe(2);
            expect(winningHand.meldWithWinningTile).toStrictEqual(new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true));
            expect(winningHand.meldWithWinningTileIndex).toStrictEqual(2);
            expect(winningHand.winningTile).toStrictEqual(FIVE_CHARACTER);
            expect(winningHand.winningTileIsPartOfPair).toBe(false);
            expect(winningHand.flowerTiles).toStrictEqual([ORCHID_GENTLEMAN.clone(), BAMBOO_GENTLEMAN.clone()]);
            expect(winningHand.isSelfDrawn()).toBe(false);

            const tgvm = winningHand.tileGroupValueMaps;
            expect(tgvm.getHonorTileGroups()).toStrictEqual(new Set([TileGroup.DRAGON]));
            expect(tgvm.getSuitedTileGroups()).toStrictEqual(new Set([TileGroup.BAMBOO, TileGroup.CHARACTER]));
            expect(tgvm.getTilesForTileValues(new Set([SuitedTileValue.ONE]))).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO]]);
            expect(tgvm.getTilesForTileGroups(new Set([TileGroup.DRAGON]))).toStrictEqual([[RED_DRAGON, RED_DRAGON, RED_DRAGON]]);
        });

        test('valid 5 melds based winning hand with passing middle length has correct fields set', () => {
            const meldList = [new Pair(ONE_BAMBOO, false), new Kong(RED_DRAGON, true),
                 new Chow([THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], true), 
                 new Pong(FIVE_CHARACTER, false), new Pong(NINE_CHARACTER, true)]
            const flowerTiles = [ORCHID_GENTLEMAN, BAMBOO_GENTLEMAN];

            const winningHand = new MeldBasedWinningHand(meldList, 0, ONE_BAMBOO, flowerTiles);
            
            expect(winningHand.tiles).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO], [RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON], 
                [THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER], [FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER],
                [NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER]
            ]);
            expect(winningHand.melds).toStrictEqual(meldList);
            expect(winningHand.tilesIndexWithWinningTile).toBe(0);
            expect(winningHand.meldWithWinningTile).toStrictEqual(new Pair(ONE_BAMBOO, false));
            expect(winningHand.meldWithWinningTileIndex).toStrictEqual(0);
            expect(winningHand.winningTile).toStrictEqual(ONE_BAMBOO);
            expect(winningHand.winningTileIsPartOfPair).toBe(true);
            expect(winningHand.flowerTiles).toStrictEqual([ORCHID_GENTLEMAN.clone(), BAMBOO_GENTLEMAN.clone()]);
            expect(winningHand.isSelfDrawn()).toBe(true);

            const tgvm = winningHand.tileGroupValueMaps;
            expect(tgvm.getHonorTileGroups()).toStrictEqual(new Set([TileGroup.DRAGON]));
            expect(tgvm.getSuitedTileGroups()).toStrictEqual(new Set([TileGroup.BAMBOO, TileGroup.CHARACTER]));
            expect(tgvm.getTilesForTileValues(new Set([SuitedTileValue.ONE]))).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO]]);
            expect(tgvm.getTilesForTileGroups(new Set([TileGroup.DRAGON]))).toStrictEqual([[RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON]]);
        });

        test

        test('valid 5 melds based winning hand with max length has correct fields set', () => {
            const meldList = [new Pair(ONE_BAMBOO, false), new Kong(RED_DRAGON, true),
                 new Kong(TWO_CIRCLE, true), new Kong(FIVE_CHARACTER, false), new Kong(NINE_CHARACTER, true)]

            const winningHand = new MeldBasedWinningHand(meldList, 0, ONE_BAMBOO, []);
            
            expect(winningHand.tiles).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO], [RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON], 
                [TWO_CIRCLE, TWO_CIRCLE, TWO_CIRCLE, TWO_CIRCLE], [FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER, FIVE_CHARACTER],
                [NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER]
            ]);
            expect(winningHand.melds).toStrictEqual(meldList);
            expect(winningHand.tilesIndexWithWinningTile).toBe(0);
            expect(winningHand.meldWithWinningTile).toStrictEqual(new Pair(ONE_BAMBOO, false));
            expect(winningHand.meldWithWinningTileIndex).toStrictEqual(0);
            expect(winningHand.winningTile).toStrictEqual(ONE_BAMBOO);
            expect(winningHand.winningTileIsPartOfPair).toBe(true);
            expect(winningHand.flowerTiles).toStrictEqual([]);
            expect(winningHand.isSelfDrawn()).toBe(true);

            const tgvm = winningHand.tileGroupValueMaps;
            expect(tgvm.getHonorTileGroups()).toStrictEqual(new Set([TileGroup.DRAGON]));
            expect(tgvm.getSuitedTileGroups()).toStrictEqual(new Set([TileGroup.BAMBOO, TileGroup.CHARACTER, TileGroup.CIRCLE]));
            expect(tgvm.getTilesForTileValues(new Set([SuitedTileValue.ONE]))).toStrictEqual([[ONE_BAMBOO, ONE_BAMBOO]]);
            expect(tgvm.getTilesForTileGroups(new Set([TileGroup.DRAGON]))).toStrictEqual([[RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON]]);
        });
    });
});