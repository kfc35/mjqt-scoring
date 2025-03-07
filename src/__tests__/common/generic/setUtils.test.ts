import { consolidateSets, getOnlyElement, getOnlyTruthyElement, wrapSet } from "common/generic/setUtils";

describe('setUtils.ts', () => {
    describe('getOnlyElement', () => {
        test('throws if set has more than one item', () => {
            expect(() => {getOnlyElement(new Set([1, 2]))}).toThrow();
        });

        test('throws if set is empty', () => {
            expect(() => {getOnlyElement(new Set())}).toThrow();
        });

        test('returns undefined if set only contains undefined', () => {
            expect(getOnlyElement(new Set([undefined]))).toBeUndefined();
        });

        test('returns null if set only contains undefined', () => {
            expect(getOnlyElement(new Set([null]))).toBeNull();
        });

        test('returns item if set contains only one item', () => {
            expect(getOnlyElement(new Set([3]))).toBe(3);
        });
    });

    describe('getOnlyTruthyElement', () => {
        test('throws if set has more than one item', () => {
            expect(() => {getOnlyTruthyElement(new Set([1, 2]))}).toThrow();
        });

        test('throws if set is empty', () => {
            expect(() => {getOnlyTruthyElement(new Set())}).toThrow();
        });

        test('throws if set only contains undefined', () => {
            expect(() => {getOnlyTruthyElement(new Set([undefined]))}).toThrow();
        });

        test('throws if set only contains undefined', () => {
            expect(() => {getOnlyTruthyElement(new Set([null]))}).toThrow();
        });

        test('returns item if set contains only one item', () => {
            expect(getOnlyTruthyElement(new Set([3]))).toBe(3);
        });
    });

    describe('consolidateSets', () => {
        test('combines sets correctly', () => {
            const expectedSet = new Set([1, 2, 3, 4, 5]);

            expect(consolidateSets([new Set([1, 2]), new Set(), new Set([2, 3]), new Set([4, 5])])).toStrictEqual(expectedSet);
        });
    });

    describe('wrapSet', () => {
        test('wraps set in outer set', () => {
            const inputSet = new Set([1, 2]);
            const expectedSet: Set<Set<number>> = new Set([inputSet]);

            expect(wrapSet(inputSet)).toStrictEqual(expectedSet);
        });
    });
});