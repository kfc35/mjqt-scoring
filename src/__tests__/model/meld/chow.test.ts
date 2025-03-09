import { EIGHT_CHARACTER, FIVE_BAMBOO, FIVE_CHARACTER, FOUR_BAMBOO, FOUR_CHARACTER, FOUR_CIRCLE, ONE_CIRCLE, SEVEN_BAMBOO, SEVEN_CHARACTER, SEVEN_CIRCLE, SIX_BAMBOO, SIX_CHARACTER, SIX_CIRCLE, THREE_CHARACTER, THREE_CIRCLE, TWO_BAMBOO, TWO_CHARACTER } from "common/deck";
import { canMakeShortStraight, Chow } from "model/meld/chow";

describe('chow.ts', () => {
    describe('constructor with knitted tiles', () => {
        test('has fields set as expected', () => {
            const chow = new Chow([SEVEN_CIRCLE, SIX_BAMBOO, EIGHT_CHARACTER], true);

            expect(chow.isKnitted()).toBe(true);
            expect(chow.isSameSuit()).toBe(false);
            expect(chow.tiles).toStrictEqual([SIX_BAMBOO, SEVEN_CIRCLE, EIGHT_CHARACTER]);
            expect(chow.exposed).toBe(true);
            expect(chow.clone()).toStrictEqual(chow);
        });
    });

    describe('constructor with reg tiles', () => {
        test('has fields set as expected', () => {
            const chow = new Chow([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER], false);

            expect(chow.isKnitted()).toBe(false);
            expect(chow.isSameSuit()).toBe(true);
            expect(chow.tiles).toStrictEqual([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER]);
            expect(chow.exposed).toBe(false);
            expect(chow.clone()).toStrictEqual(chow);
        });
    });

    test('throws when there are non sequence tiles', () => {
        expect(() => {new Chow([THREE_CIRCLE, ONE_CIRCLE, FOUR_CIRCLE]);}).toThrow()
    });

    test('throws when the tiles are not knitted nor the same suit', () => {
        expect(() => {new Chow([TWO_BAMBOO, THREE_CIRCLE, ONE_CIRCLE]);}).toThrow()
    });

    describe('canMakeShortStraight', () => {
        test('returns true when lower and higher chow are valid and both are same suit', () => {
            const lowerChow = new Chow([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER]);
            const higherChow = new Chow([FIVE_CHARACTER, SIX_CHARACTER, SEVEN_CHARACTER], true);

            expect(canMakeShortStraight(lowerChow, higherChow)).toBe(true);
        });

        test('returns true when lower and higher chow are valid and both are knitted the same way', () => {
            const lowerChow = new Chow([TWO_CHARACTER, THREE_CIRCLE, FOUR_BAMBOO]);
            const higherChow = new Chow([FIVE_CHARACTER, SIX_CIRCLE, SEVEN_BAMBOO], true);

            expect(canMakeShortStraight(lowerChow, higherChow)).toBe(true);
        });

        test('returns false when lower and higher chow are valid but not knitted the same way', () => {
            const lowerChow = new Chow([TWO_CHARACTER, THREE_CIRCLE, FOUR_BAMBOO]);
            const higherChow = new Chow([FIVE_BAMBOO, SIX_CIRCLE, SEVEN_CHARACTER], true);

            expect(canMakeShortStraight(lowerChow, higherChow)).toBe(false);
        });

        test('returns false when lower and higher chow are valid but are different suits', () => {
            const lowerChow = new Chow([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER]);
            const higherChow = new Chow([FIVE_BAMBOO, SIX_BAMBOO, SEVEN_BAMBOO], true);

            expect(canMakeShortStraight(lowerChow, higherChow)).toBe(false);
        });

        test('returns false when lower and higher chow are switched', () => {
            const lowerChow = new Chow([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER]);
            const higherChow = new Chow([FIVE_CHARACTER, SIX_CHARACTER, SEVEN_CHARACTER], true);

            expect(canMakeShortStraight(higherChow, lowerChow)).toBe(false);
        });
    });
});