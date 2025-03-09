import { AUTUMN_SEASON, EAST_WIND, EIGHT_CHARACTER, FIVE_BAMBOO, FIVE_CHARACTER, 
    FOUR_BAMBOO, FOUR_CHARACTER, NINE_CIRCLE, ONE_BAMBOO, 
    PLUM_GENTLEMAN, RED_DRAGON, SEVEN_CHARACTER, SIX_BAMBOO, 
    SIX_CHARACTER, SPRING_SEASON, THREE_BAMBOO, 
    THREE_CHARACTER, TWO_BAMBOO, WEST_WIND } from "common/deck";
import { Hand } from "model/hand/hk/hand";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { Chow } from "model/meld/chow";
import { Kong } from "model/meld/kong";
import { TileGroup } from "model/tile/tileGroup";
import { SuitedTileValue } from "model/tile/tileValue";

describe('hand.ts', () => {
    describe('constructor', () => {
        test('throws when tiles is less than min length of 14', () => {
            expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO], new MostRecentTileContext(TWO_BAMBOO, false))})
                .toThrow();
        });

        test('throws when tiles is greater than max length of 26', () => {
            expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO,
                THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER, SIX_CHARACTER, SEVEN_CHARACTER, EIGHT_CHARACTER,
                NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                EAST_WIND, EAST_WIND, WEST_WIND, WEST_WIND, WEST_WIND, WEST_WIND,
                PLUM_GENTLEMAN, SPRING_SEASON, AUTUMN_SEASON
            ], new MostRecentTileContext(TWO_BAMBOO, false))})
                .toThrow();
        });

        test('throws when tiles has a duplicate flower tile', () => {
            expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, 
                RED_DRAGON, RED_DRAGON, RED_DRAGON,
                EAST_WIND, EAST_WIND,
                PLUM_GENTLEMAN, AUTUMN_SEASON, PLUM_GENTLEMAN
            ], new MostRecentTileContext(TWO_BAMBOO, false))})
                .toThrow();
        });

        test('throws when tiles has less than minimum suited and honor tiles of 14', () => {
            expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                RED_DRAGON, RED_DRAGON,
                EAST_WIND, EAST_WIND,
                PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
            ], new MostRecentTileContext(TWO_BAMBOO, false))})
                .toThrow();
        });

        test('throws when tiles has more than maximum suited and honor tiles of 18', () => {
            expect(() => {new Hand([TWO_BAMBOO, TWO_BAMBOO, TWO_BAMBOO, TWO_BAMBOO,
                THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER, THREE_CHARACTER,
                NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                EAST_WIND, EAST_WIND, EAST_WIND,
                PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
            ], new MostRecentTileContext(TWO_BAMBOO, false))})
                .toThrow();
        });

        test('throws when there is a tile that has more than its quantity', () => {
            expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                RED_DRAGON, RED_DRAGON, RED_DRAGON,
                EAST_WIND, EAST_WIND,
                PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
            ], new MostRecentTileContext(TWO_BAMBOO, false))})
                .toThrow();
        });

        test('throws when the tile in most recent tile context is not in tiles', () => {
            expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                RED_DRAGON, RED_DRAGON, RED_DRAGON,
                EAST_WIND, EAST_WIND,
                PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
            ], new MostRecentTileContext(WEST_WIND, false))})
                .toThrow();
        });

        describe('without userSpecifiedMelds', () => {
            test('valid hand has correct values for fields', () => {
                const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, false));

                expect(hand.flowerTiles).toStrictEqual([PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON]);
                expect(hand.getQuantity(TileGroup.BAMBOO, SuitedTileValue.ONE)).toBe(1);
                expect(hand.getQuantity(NINE_CIRCLE)).toBe(4);
                expect(hand.getTotalQuantity(true)).toBe(18);
                expect(hand.getTotalQuantity(false)).toBe(15);
                expect(hand.mostRecentTile()).toStrictEqual(TWO_BAMBOO);
                expect(hand.mostRecentTileIsSelfDrawn()).toBe(false);
                expect(hand.mostRecentTileUserSpecifiedMeld()).toBeUndefined();
                expect(hand.userSpecifiedMelds).toStrictEqual([]);
            });
        });

        describe('with userSpecifiedMelds', () => {
            test('throws when there are not enough tiles in hand for the melds', () => {
                expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, false), [new Kong(RED_DRAGON)])}).toThrow();
            });

            test('throws when a tile in melds is not in the hands tiles', () => {
                expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, false), [new Chow([FOUR_CHARACTER, FIVE_CHARACTER, SIX_CHARACTER])])}).toThrow();
            });

            test('throws when most recent tile contexts meld is not in userSpecifiedMelds', () => {
                expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false)), 
                [new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], true)])}).toThrow();

                expect(() => {new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false)), 
                [new Kong(NINE_CIRCLE, true)])}).toThrow();
            });

            test('valid hand has correct values for fields', () => {
                const hand = new Hand([ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
                    THREE_CHARACTER, FOUR_CHARACTER, FIVE_CHARACTER,
                    NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE, NINE_CIRCLE,
                    RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    EAST_WIND, EAST_WIND,
                    PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON
                ], new MostRecentTileContext(TWO_BAMBOO, new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false)),
                [new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false), new Kong(NINE_CIRCLE)]);

                expect(hand.flowerTiles).toStrictEqual([PLUM_GENTLEMAN, AUTUMN_SEASON, SPRING_SEASON]);
                expect(hand.getQuantity(TileGroup.BAMBOO, SuitedTileValue.ONE)).toBe(1);
                expect(hand.getQuantity(NINE_CIRCLE)).toBe(4);
                expect(hand.getTotalQuantity(true)).toBe(18);
                expect(hand.getTotalQuantity(false)).toBe(15);
                expect(hand.mostRecentTile()).toStrictEqual(TWO_BAMBOO);
                expect(hand.mostRecentTileIsSelfDrawn()).toBe(true);
                expect(hand.mostRecentTileUserSpecifiedMeld()).toStrictEqual(new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false));
                expect(hand.userSpecifiedMelds).toStrictEqual([new Chow([THREE_BAMBOO, ONE_BAMBOO, TWO_BAMBOO], false), new Kong(NINE_CIRCLE)]);
            });
        });
    });
});