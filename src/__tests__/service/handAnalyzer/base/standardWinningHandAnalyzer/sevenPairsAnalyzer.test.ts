import { ONE_CIRCLE, THREE_BAMBOO, WHITE_DRAGON, NINE_CHARACTER, WEST_WIND, EAST_WIND, SUMMER_SEASON, ORCHID_GENTLEMAN, FOUR_BAMBOO, FIVE_BAMBOO, NORTH_WIND } from "common/deck";
import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { analyzeForSevenPairs } from "service/handAnalyzer/base/standardWinningHandAnalyzer/sevenPairsAnalyzer";
import { Pair } from "model/meld/pair";
import { Kong } from "model/meld/kong";
import { TileGroup } from "model/tile/tileGroup";

describe('sevenPairsAnalyzer.ts', () => {

    test('seven pairs hand without userDefinedMelds is detected correctly', () => {
        const hand = new Hand([ONE_CIRCLE, ONE_CIRCLE, THREE_BAMBOO, THREE_BAMBOO,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            WEST_WIND, WEST_WIND, EAST_WIND, EAST_WIND,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, true), 
            []);

            const winningHands = analyzeForSevenPairs(hand);

            expect(winningHands.length).toBe(1);
            const winningHand = winningHands[0];
            expect(winningHand?.flowerTiles).toStrictEqual([SUMMER_SEASON, ORCHID_GENTLEMAN]);
            expect(winningHand?.isSelfDrawn()).toStrictEqual(true);
            expect(winningHand?.meldWithWinningTile).toStrictEqual(new Pair(ONE_CIRCLE, false));
            expect(winningHand?.melds[winningHand?.meldWithWinningTileIndex])
                .toStrictEqual(new Pair(ONE_CIRCLE, false));
            expect(new Set(winningHand?.melds)).toStrictEqual(new Set([new Pair(ONE_CIRCLE, false), new Pair(THREE_BAMBOO, false), 
                new Pair(NINE_CHARACTER, false), new Pair(NINE_CHARACTER, false), new Pair(WEST_WIND, false),
                new Pair(EAST_WIND, false), new Pair(WHITE_DRAGON, false)
            ]));
            expect(winningHand?.melds.filter(meld => meld.equals(new Pair(NINE_CHARACTER, false), false)).length).toBe(2);
            expect(winningHand?.winningTile).toBe(ONE_CIRCLE);
            expect(winningHand?.winningTileIsPartOfPair).toBe(true);
            const tgvm = winningHand?.tileGroupValueMaps;
            expect(tgvm?.getTilesForTileGroups(new Set([TileGroup.WIND]))).toStrictEqual([[WEST_WIND, WEST_WIND, EAST_WIND, EAST_WIND]]);
    });

    test('seven pairs hand with incorrect userDefinedMelds (i.e. a kong) is not detected correctly.', () => {
        const hand = new Hand([ONE_CIRCLE, ONE_CIRCLE, THREE_BAMBOO, THREE_BAMBOO,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            WEST_WIND, WEST_WIND, EAST_WIND, EAST_WIND,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, true), 
            [new Kong(NINE_CHARACTER)]);

            const winningHands = analyzeForSevenPairs(hand);

            expect(winningHands.length).toBe(0);
    });

    test('seven pairs hand with userDefinedMelds places userDefinedMelds in winningHand melds', () => {
        const hand = new Hand([ONE_CIRCLE, ONE_CIRCLE, THREE_BAMBOO, THREE_BAMBOO,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            WEST_WIND, WEST_WIND, WEST_WIND, WEST_WIND,
            WHITE_DRAGON, WHITE_DRAGON,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(NINE_CHARACTER, new Pair(NINE_CHARACTER, true)), 
            [new Pair(ONE_CIRCLE), new Pair(THREE_BAMBOO), new Pair(NINE_CHARACTER, true)]);

            const winningHands = analyzeForSevenPairs(hand);

            expect(winningHands.length).toBe(1);
            const winningHand = winningHands[0];
            expect(winningHand?.melds[winningHand?.meldWithWinningTileIndex])
                .toStrictEqual(new Pair(NINE_CHARACTER, true));
            expect(new Set(winningHand?.melds)).toStrictEqual(new Set([new Pair(ONE_CIRCLE), new Pair(THREE_BAMBOO), 
                new Pair(NINE_CHARACTER, true), new Pair(NINE_CHARACTER, false), new Pair(WEST_WIND, false),
                new Pair(WEST_WIND, false), new Pair(WHITE_DRAGON, false)
            ]));
            expect(winningHand?.melds.filter(meld => meld.equals(new Pair(WEST_WIND, false), false)).length).toBe(2);
    });

    test('regular melded hand is not a seven pairs hand', () => {
        const hand = new Hand([ONE_CIRCLE, ONE_CIRCLE, ONE_CIRCLE,
            THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO,
            NINE_CHARACTER, NINE_CHARACTER, NINE_CHARACTER,
            WEST_WIND, WEST_WIND, WEST_WIND,
            NORTH_WIND, NORTH_WIND,
            SUMMER_SEASON, ORCHID_GENTLEMAN
            ], new MostRecentTileContext(ONE_CIRCLE, true), 
            []);

        const winningHands = analyzeForSevenPairs(hand);

        expect(winningHands.length).toBe(0);
    });
});