import { FIVE_BAMBOO, FOUR_BAMBOO, ONE_BAMBOO, THREE_BAMBOO, SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE, RED_DRAGON, NINE_CIRCLE, GREEN_DRAGON, TWO_BAMBOO, ONE_CIRCLE, TWO_CIRCLE } from "common/deck";
import { cartesianProduct, getAllIndicesSet, getIndexOfMeld, getMeldAtIndex, getMeldsSubsetFromIndicesSet, meldHasTile, meldsAreSubset, meldsHasOnePair, meldsNotNull, meldsNotNullAndCorrectLength, meldsNumKongs, meldsNumTiles, meldToFlatTiles } from "common/meldUtils";
import { Chow } from "model/meld/chow";
import { Kong } from "model/meld/kong";
import { Pair } from "model/meld/pair";
import { Pong } from "model/meld/pong";

describe('meldUtils.ts', () => {

    describe('meldsNotNull', () => {
        test('returns true when melds is empty', () => {
            expect(meldsNotNull([])).toBe(true);
        });

        test('returns true when all melds are not null and not undefined', () => {
            expect(meldsNotNull([new Pong(ONE_BAMBOO), new Pong(THREE_BAMBOO)])).toBe(true);
        });
    });
    describe('meldsNotNullAndCorrectLength', () => {
        test('returns false when melds is not correct length', () => {
            expect(meldsNotNullAndCorrectLength([new Pong(ONE_BAMBOO), new Pong(THREE_BAMBOO)], 3))
                .toBe(false);
        });

        test('returns true when melds are correct length', () => {
            expect(meldsNotNullAndCorrectLength([new Pong(ONE_BAMBOO), new Pong(THREE_BAMBOO)], 2))
                .toBe(true);
        });
    });

    describe('meldHasOnePair', () => {
        test('returns false when melds does not have pair', () => {
            expect(meldsHasOnePair([new Pong(ONE_BAMBOO), new Pong(THREE_BAMBOO)]))
                .toBe(false);
        });

        test('returns true when melds has pair', () => {
            expect(meldsHasOnePair([new Pong(ONE_BAMBOO), new Pair(THREE_BAMBOO)]))
                .toBe(true);
        });
    });

    describe('meldsNumKongs', () => {
        test('returns 0 when there are no kongs', () => {
            expect(meldsNumKongs([new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE]), 
            new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Pong(RED_DRAGON), new Pair(THREE_BAMBOO)]))
                .toBe(0);
        });

        test('returns correct number of kongs', () => {
            expect(meldsNumKongs([new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE]), 
            new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Kong(RED_DRAGON), new Pair(THREE_BAMBOO)]))
                .toBe(1);
        });
    });

    describe('meldsNumTiles', () => {
        test('returns 0 when there are no melds', () => {
            expect(meldsNumTiles([])).toBe(0);
        });

        test('returns correct number of tiles', () => {
            expect(meldsNumTiles([new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE]), 
            new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Kong(RED_DRAGON), new Pair(THREE_BAMBOO)]))
                .toBe(15);
        });
    });

    describe('meldToFlatTiles', () => {
        test('returns empty array when there are no melds', () => {
            expect(meldToFlatTiles([])).toStrictEqual([]);
        });

        test('returns tiles in order', () => {
            expect(meldToFlatTiles([new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE]), 
            new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Kong(RED_DRAGON), new Pair(THREE_BAMBOO)]))
                .toStrictEqual([ONE_BAMBOO, ONE_BAMBOO, ONE_BAMBOO, SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE,
                    THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO, RED_DRAGON, RED_DRAGON, RED_DRAGON, RED_DRAGON,
                    THREE_BAMBOO, THREE_BAMBOO
                ]);
        });
    });

    describe('meldHasTiles', () => {
        test('returns true when meld has tile', () => {
            expect(meldHasTile(new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE]), SIX_CIRCLE)).toBe(true);
        });

        test('returns false when meld does not have tile', () => {
            expect(meldHasTile(new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE]), NINE_CIRCLE)).toBe(false);
        });
    });

    describe('meldsAreSubset', () => {
        describe('unique melds in input', () => {
            const input = [new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE], true), 
                new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Kong(RED_DRAGON, true), new Pair(THREE_BAMBOO)];

            test('returns false when melds is subset of input but wrong exposed flag', () => {
                expect(meldsAreSubset(input, [new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], true), new Kong(RED_DRAGON, false)]))
                    .toBe(false);
            });

            test('returns true when melds is subset of input with matching exposed flags', () => {
                expect(meldsAreSubset(input, [new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], true), new Kong(RED_DRAGON, true)]))
                    .toBe(true);
            });
    
            test('returns false when subset has meld not in input', () => {
                expect(meldsAreSubset(input, [new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], true), new Kong(GREEN_DRAGON)]))
                    .toBe(false);
            });
        });
        
        describe('duplicate melds in input', () => {
            const dupInput = [new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE], true), 
                new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE], false), new Kong(RED_DRAGON, true), new Pair(THREE_BAMBOO)];
            
            test('ignoreExposed = false returns true when melds is subset of input with matching exposed flags', () => {
                expect(meldsAreSubset(dupInput, [new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], false), new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], true)]))
                .toBe(true);
            });

            test('ignoreExposed = false returns false when melds is subset of input but wrong exposed flags', () => {
                expect(meldsAreSubset(dupInput, [new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], true), new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], true)]))
                .toBe(false);
            });
        });
    });

    describe('getIndexOfMeld', () => {
        const input = [new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE], true), 
            new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Kong(RED_DRAGON, true), new Pair(THREE_BAMBOO)];
        
        describe('ignoreExposed = true', () => {
            test('returns index when melds is subset of input with wrong exposed flags', () => {
                expect(getIndexOfMeld(input, new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], false), true))
                    .toBe(1);
            });

            test('returns index when melds is subset of input with matching exposed flags', () => {
                expect(getIndexOfMeld(input, new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], true), true))
                    .toBe(1);
            });
    
            test('returns undefined when subset has meld not in input', () => {
                expect(getIndexOfMeld(input, new Kong(GREEN_DRAGON), true))
                    .toBeUndefined();
            });
        });

        describe('ignoreExposed = false', () => {
            test('returns undefined when melds is subset of input but wrong exposed flag', () => {
                expect(getIndexOfMeld(input, new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], false), false))
                    .toBeUndefined();
            });

            test('returns index when melds is subset of input with matching exposed flags', () => {
                expect(getIndexOfMeld(input, new Chow([SEVEN_CIRCLE, EIGHT_CIRCLE, SIX_CIRCLE], true), false))
                    .toBe(1);
            });
    
            test('returns undefined when subset has meld not in input', () => {
                expect(getIndexOfMeld(input, new Kong(GREEN_DRAGON), false))
                    .toBeUndefined();
            });
        });
    });

    describe('cartesianProduct', () => {
        test('of two empty lists is the empty list', () => {
            expect(cartesianProduct([], [])).toStrictEqual([]);
        });

        test('of one item nested list and empty list is the one item nested list', () => {
            expect(cartesianProduct([[new Pair(ONE_BAMBOO)]], [])).toStrictEqual([[new Pair(ONE_BAMBOO)]]);
            expect(cartesianProduct([],[[new Pair(ONE_BAMBOO)]])).toStrictEqual([[new Pair(ONE_BAMBOO)]]);
        });

        test('of a list containing empty list and one item nested list is the one item nested list', () => {
            expect(cartesianProduct([[]], [[new Pair(ONE_BAMBOO)]])).toStrictEqual([[new Pair(ONE_BAMBOO)]]);
            expect(cartesianProduct([[new Pair(ONE_BAMBOO)]], [[]])).toStrictEqual([[new Pair(ONE_BAMBOO)]]);
        });

        test('of two one item nested lists is a nested list of the two items', () => {
            expect(cartesianProduct([[new Pair(ONE_CIRCLE)]], [[new Pair(ONE_BAMBOO)]])).toStrictEqual([[new Pair(ONE_CIRCLE), new Pair(ONE_BAMBOO)]]);
        });

        test('of one one item nested list and one two item nested list is one list of them combined', () => {
            expect(cartesianProduct([[new Pair(ONE_CIRCLE)]], [[new Pair(ONE_BAMBOO), new Pair(TWO_BAMBOO)]])).toStrictEqual([[new Pair(ONE_CIRCLE), new Pair(ONE_BAMBOO), new Pair(TWO_BAMBOO)]]);
        });

        test('of two one item nested lists and one two item nested list is two lists', () => {
            expect(cartesianProduct([[new Pair(ONE_CIRCLE)], [new Pair(TWO_CIRCLE)]], [[new Pair(ONE_BAMBOO), new Pair(TWO_BAMBOO)]]))
            .toStrictEqual([[new Pair(ONE_CIRCLE), new Pair(ONE_BAMBOO), new Pair(TWO_BAMBOO)], [new Pair(TWO_CIRCLE), new Pair(ONE_BAMBOO), new Pair(TWO_BAMBOO)]]);
        });

        test('of two one item nested lists and two one item nested lists is four lists', () => {
            expect(cartesianProduct([[new Pair(ONE_CIRCLE)], [new Pair(TWO_CIRCLE)]], [[new Pair(ONE_BAMBOO)], [new Pair(TWO_BAMBOO)]]))
            .toStrictEqual([[new Pair(ONE_CIRCLE), new Pair(ONE_BAMBOO)], [new Pair(ONE_CIRCLE), new Pair(TWO_BAMBOO)], 
            [new Pair(TWO_CIRCLE), new Pair(ONE_BAMBOO)],[new Pair(TWO_CIRCLE), new Pair(TWO_BAMBOO)]]);
        });
    });

    describe('getMeldsSubsetFromIndicesSet', () => {
        const input = [new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE], true), 
            new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Kong(RED_DRAGON, true), new Pair(THREE_BAMBOO)];
        
        test('returns expected melds when indices specified', () => {
            expect(getMeldsSubsetFromIndicesSet(input, new Set([2, 4]))).toStrictEqual([input[2], input[4]]);
        });

        test('returns no melds when invalid indices specified', () => {
            expect(getMeldsSubsetFromIndicesSet(input, new Set([-1, 10]))).toStrictEqual([]);
        });

    });

    describe('getAllIndicesSet', () => {
        const input = [new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE], true), 
            new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Kong(RED_DRAGON, true), new Pair(THREE_BAMBOO)];
        
        test('returns expected Set', () => {
            expect(getAllIndicesSet(input)).toStrictEqual(new Set([0, 1, 2, 3, 4]));
        });
    });

    describe('getMeldAtIndex', () => {
        const input = [new Pong(ONE_BAMBOO), new Chow([SIX_CIRCLE, SEVEN_CIRCLE, EIGHT_CIRCLE], true), 
            new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]), new Kong(RED_DRAGON, true), new Pair(THREE_BAMBOO)];
        
        test('throws with negative index', () => {
            expect(() => {getMeldAtIndex(input, -1)}).toThrow();
        });

        test('throws with index > length', () => {
            expect(() => {getMeldAtIndex(input, 10)}).toThrow();
        });

        test('returns expected meld with valid index', () => {
            expect(getMeldAtIndex(input, 2)).toStrictEqual(input[2]);
        });
    });
});