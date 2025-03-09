import { FIVE_BAMBOO, FOUR_BAMBOO, NORTH_WIND, ONE_BAMBOO, SEVEN_BAMBOO, THREE_BAMBOO } from "common/deck";
import { Chow, meldIsChow } from "model/meld/chow";
import { meldIsKong, Kong } from "model/meld/kong";
import type { Meld } from "model/meld/meld";
import { meldIsPair, Pair } from "model/meld/pair";
import { meldIsPong, Pong } from "model/meld/pong";

describe('meld.ts implementing classes (chow.ts, kong.ts, pair.ts, pong.ts)', () => {
    describe('pair', () => {
        const pair: Meld = new Pair(ONE_BAMBOO);

        test('meldIsPair is true', () => {
            expect(meldIsPair(pair)).toBe(true);
        });

        test('meldIsChow is false', () => {
            expect(meldIsChow(pair)).toBe(false);
        });

        test('meldIsPong is false', () => {
            expect(meldIsPong(pair)).toBe(false);
        });

        test('meldIsKong is false', () => {
            expect(meldIsKong(pair)).toBe(false);
        });
    });

    describe('chow', () => {
        const chow: Meld = new Chow([THREE_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO]);

        test('meldIsPair is false', () => {
            expect(meldIsPair(chow)).toBe(false);
        });

        test('meldIsChow is true', () => {
            expect(meldIsChow(chow)).toBe(true);
        });

        test('meldIsPong is false', () => {
            expect(meldIsPong(chow)).toBe(false);
        });

        test('meldIsKong is false', () => {
            expect(meldIsKong(chow)).toBe(false);
        });
    });

    describe('pong', () => {
        const pong: Meld = new Pong(NORTH_WIND);

        test('meldIsPair is false', () => {
            expect(meldIsPair(pong)).toBe(false);
        });

        test('meldIsChow is false', () => {
            expect(meldIsChow(pong)).toBe(false);
        });

        test('meldIsPong is true', () => {
            expect(meldIsPong(pong)).toBe(true);
        });

        test('meldIsKong is false', () => {
            expect(meldIsKong(pong)).toBe(false);
        });
    });

    describe('kong', () => {
        const kong: Meld = new Kong(SEVEN_BAMBOO);

        test('meldIsPair is false', () => {
            expect(meldIsPair(kong)).toBe(false);
        });

        test('meldIsChow is false', () => {
            expect(meldIsChow(kong)).toBe(false);
        });

        test('meldIsPong is false', () => {
            expect(meldIsPong(kong)).toBe(false);
        });

        test('meldIsKong is false', () => {
            expect(meldIsKong(kong)).toBe(true);
        });
    });
});