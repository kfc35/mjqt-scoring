import { addToMapValueSet, pushToMapValueArray } from "common/generic/mapUtils";

describe('mapUtils.ts', () => {
    describe('pushToMapValueArray', () => {
        test('creates a new array for an unset key', () => {
            const inputMap: Map<string, number[]> = new Map();
            const expectedMap: Map<string, number[]> = new Map();
            expectedMap.set("hello", [1, 2, 3]);

            pushToMapValueArray(inputMap, "hello", ...[1, 2, 3]);

            expect(inputMap).toStrictEqual(expectedMap);
        });

        test('appends to array for a set key', () => {
            const inputMap: Map<string, number[]> = new Map();
            inputMap.set("hello", [1, 2, 3]);
            const expectedMap: Map<string, number[]> = new Map();
            expectedMap.set("hello", [1, 2, 3, 4, 5, 6]);

            pushToMapValueArray(inputMap, "hello", ...[4, 5, 6]);

            expect(inputMap).toStrictEqual(expectedMap);
        });
    });

    describe('addToMapValueSet', () => {
        test('creates a new set for an unset key', () => {
            const inputMap: Map<string, Set<number>> = new Map();
            const expectedMap: Map<string, Set<number>> = new Map();
            expectedMap.set("hello", new Set([1, 2, 3]));

            addToMapValueSet(inputMap, "hello", ...[1, 2, 3]);
            
            expect(inputMap).toStrictEqual(expectedMap);
        });

        test('adds to existing set for a set key', () => {
            const inputMap: Map<string, Set<number>> = new Map();
            inputMap.set("hello", new Set([1, 2, 3]));
            const expectedMap: Map<string, Set<number>> = new Map();
            expectedMap.set("hello", new Set([1, 2, 3, 4, 5]));

            addToMapValueSet(inputMap, "hello", ...[3, 4, 5]);

            expect(inputMap).toStrictEqual(expectedMap);
        });
    });
});