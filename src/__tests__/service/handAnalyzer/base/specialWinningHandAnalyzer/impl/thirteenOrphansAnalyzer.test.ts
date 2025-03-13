import { EAST_WIND, FIVE_CIRCLE, FOUR_CIRCLE, GREEN_DRAGON, NINE_BAMBOO, NINE_CHARACTER, NINE_CIRCLE, NORTH_WIND, 
    ONE_BAMBOO, ONE_CHARACTER, ONE_CIRCLE, RED_DRAGON, SIX_CIRCLE, SOUTH_WIND, SUMMER_SEASON, WEST_WIND, 
    WHITE_DRAGON} from "common/deck";
import { Hand } from "model/hand/hk/hand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { Pong } from "model/meld/pong";
import { Pair } from "model/meld/pair";
import { TileGroup } from "model/tile/tileGroup";
import { Tile } from "model/tile/tile";
import { thirteenOrphansAnalyzer, thirteenOrphanTiles } from "service/handAnalyzer/base/specialWinningHandAnalyzer/impl/thirteenOrphansAnalyzer";
import { SuitedTileValue } from "model/tile/tileValue";
describe('thirteenOrphansAnalyzer.ts', () => {

    test('meld based hand with a kong are not analyzed as a thirteen orphans hand', () => {
        const hand = new Hand([ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON,
            EAST_WIND, EAST_WIND, SUMMER_SEASON
            ], new MostRecentTileContext(NINE_CHARACTER, new Pong(NINE_CHARACTER, true)), 
            [new Pong(NINE_CHARACTER, true)]);

            const specialWinningHand = thirteenOrphansAnalyzer(hand);

            expect(specialWinningHand.length).toBe(0);
    });

    test('meld based hand without a kong are not analyzed as a thirteen orphans hand', () => {
        const hand = new Hand([ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE,
            RED_DRAGON, RED_DRAGON, RED_DRAGON,
            EAST_WIND, EAST_WIND, SUMMER_SEASON
            ], new MostRecentTileContext(NINE_CHARACTER, new Pong(NINE_CHARACTER, true)), 
            [new Pong(NINE_CHARACTER, true)]);

            const specialWinningHand = thirteenOrphansAnalyzer(hand);

            expect(specialWinningHand.length).toBe(0);
    });

    test('hands with more than one pair in orphans without missing any orphans are not analyzed as a thirteen orphans hand', () => {
        const hand = new Hand([ONE_BAMBOO, ONE_BAMBOO, NINE_BAMBOO, NINE_BAMBOO,
            ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE,
            RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON,
            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, SUMMER_SEASON
            ], new MostRecentTileContext(NINE_CHARACTER, true), []);

            const specialWinningHand = thirteenOrphansAnalyzer(hand);

            expect(specialWinningHand.length).toBe(0);
    });

    test('hands with two orphan pairs and missing an orphan are not analyzed as a thirteen orphans hand', () => {
        const hand = new Hand([ONE_BAMBOO, ONE_BAMBOO,
            ONE_CHARACTER, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE,
            RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON,
            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, SUMMER_SEASON
            ], new MostRecentTileContext(NINE_CHARACTER, true), []);

            const specialWinningHand = thirteenOrphansAnalyzer(hand);

            expect(specialWinningHand.length).toBe(0);
    });

    test('hands with three of an orphan and missing an orphan are not analyzed as a thirteen orphans hand', () => {
        const hand = new Hand([ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO,
            ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE,
            RED_DRAGON, GREEN_DRAGON, WHITE_DRAGON,
            EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND, SUMMER_SEASON
            ], new MostRecentTileContext(NINE_CHARACTER, true), []);

            const specialWinningHand = thirteenOrphansAnalyzer(hand);

            expect(specialWinningHand.length).toBe(0);
    });

    test('thirteenOrphansAnalyzer hands without user specified pair are correctly detected', () => {
        for (const dupTile of thirteenOrphanTiles) {
            const tiles = [...thirteenOrphanTiles, dupTile, SUMMER_SEASON];
            const hand = new Hand(tiles, new MostRecentTileContext(NINE_CHARACTER, false), []);

            const specialWinningHands = thirteenOrphansAnalyzer(hand);

            expect(specialWinningHands.length).toBe(1);
            const winningHand = specialWinningHands[0];
            expect(winningHand).toBeDefined();
            const flatTiles = winningHand?.tiles.reduce<ReadonlyArray<Tile>>((accum, tileList) => accum.concat(tileList), []);
            expect(flatTiles).toEqual(expect.arrayContaining([...thirteenOrphanTiles, dupTile]));
            expect(flatTiles?.length).toBe(14);
            expect(winningHand?.flowerTiles).toStrictEqual([SUMMER_SEASON]);
            expect(winningHand?.winningTile).toStrictEqual(NINE_CHARACTER);
            expect(winningHand?.winningTileIsPartOfPair).toBe(dupTile.equals(NINE_CHARACTER));
            expect(winningHand?.tilesIndexWithWinningTile).toBe(dupTile.equals(NINE_CHARACTER) ? 1 : 0);
            expect(winningHand?.isSelfDrawn()).toBe(false);
            expect(winningHand?.specialWinningHandType).toBe(SpecialWinningHandType.THIRTEEN_ORPHANS);
            const tgvm = winningHand?.tileGroupValueMaps;
            expect(tgvm).toBeDefined();
            const characterTiles = dupTile.group === TileGroup.CHARACTER  && dupTile.value === SuitedTileValue.ONE? [NINE_CHARACTER, ONE_CHARACTER, ONE_CHARACTER] : 
                dupTile.group === TileGroup.CHARACTER  && dupTile.value === SuitedTileValue.NINE ? [ONE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER] : 
                [ONE_CHARACTER, NINE_CHARACTER];
            expect(tgvm?.getTilesForTileGroups(new Set([TileGroup.CHARACTER])))
                .toStrictEqual([characterTiles]);
        }
    });

    test('thirteenOrphansAnalyzer hands with user specified pair is correctly detected', () => {
        const dupTile = NINE_CHARACTER;
        const tiles = [...thirteenOrphanTiles, dupTile, SUMMER_SEASON];
        const hand = new Hand(tiles, new MostRecentTileContext(NINE_CHARACTER, new Pair(NINE_CHARACTER, false)), 
            [new Pair(NINE_CHARACTER, false)]);

        const specialWinningHands = thirteenOrphansAnalyzer(hand);

        expect(specialWinningHands.length).toBe(1);
        const winningHand = specialWinningHands[0];
        expect(winningHand).toBeDefined();
        const flatTiles = winningHand?.tiles.reduce<ReadonlyArray<Tile>>((accum, tileList) => accum.concat(tileList), []);
        expect(flatTiles).toEqual(expect.arrayContaining([...thirteenOrphanTiles, dupTile]));
        expect(flatTiles?.length).toBe(14);
        expect(winningHand?.tiles[1]).toStrictEqual([dupTile, dupTile]);
        expect(winningHand?.flowerTiles).toStrictEqual([SUMMER_SEASON]);
        expect(winningHand?.winningTile).toStrictEqual(NINE_CHARACTER);
        expect(winningHand?.winningTileIsPartOfPair).toBe(true);
        expect(winningHand?.tilesIndexWithWinningTile).toBe(1);
        expect(winningHand?.isSelfDrawn()).toBe(true);
        expect(winningHand?.specialWinningHandType).toBe(SpecialWinningHandType.THIRTEEN_ORPHANS);
        const tgvm = winningHand?.tileGroupValueMaps;
        expect(tgvm).toBeDefined();
        expect(tgvm?.getTilesForTileGroups(new Set([TileGroup.WIND, TileGroup.CHARACTER])))
            .toStrictEqual([[EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND], [ONE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER]]);
    });
});