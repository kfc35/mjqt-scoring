import { EIGHT_CHARACTER, FOUR_CHARACTER, FOUR_CIRCLE, ONE_CIRCLE, SEVEN_CIRCLE, SIX_BAMBOO, THREE_CHARACTER, THREE_CIRCLE, TWO_BAMBOO, TWO_CHARACTER } from "common/deck";
import { Chow } from "model/meld/chow";

describe('chow.ts', () => {
    describe('constructor with knitted tiles', () => {
        test('has fields set as expected', () => {
            const chow = new Chow([SEVEN_CIRCLE, SIX_BAMBOO, EIGHT_CHARACTER], true);

            expect(chow.isKnitted()).toBe(true);
            expect(chow.isSameSuit()).toBe(false);
            expect(chow.tiles).toStrictEqual([SIX_BAMBOO, SEVEN_CIRCLE, EIGHT_CHARACTER]);
            expect(chow.exposed).toBe(true);
        });
    });

    describe('constructor with reg tiles', () => {
        test('has fields set as expected', () => {
            const chow = new Chow([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER], false);

            expect(chow.isKnitted()).toBe(false);
            expect(chow.isSameSuit()).toBe(true);
            expect(chow.tiles).toStrictEqual([TWO_CHARACTER, THREE_CHARACTER, FOUR_CHARACTER]);
            expect(chow.exposed).toBe(false);
        });
    });

    test('throws when there are non sequence tiles', () => {
        expect(() => {new Chow([THREE_CIRCLE, ONE_CIRCLE, FOUR_CIRCLE]);}).toThrow()
    });

    test('throws when the tiles are not knitted nor the same suit', () => {
        expect(() => {new Chow([TWO_BAMBOO, THREE_CIRCLE, ONE_CIRCLE]);}).toThrow()
    });
});