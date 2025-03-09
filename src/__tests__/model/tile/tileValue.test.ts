import { isSuitedTileValue, suitedTileValues, dragonTileValues, windTileValues, 
    gentlemanTileValues, seasonTileValues, getNextSuitedTileValue, SuitedTileValue, 
    isTerminalSuitedTileValue, isGentlemanTileValue, 
    isSeasonTileValue,
    isDragonTileValue,
    isWindTileValue} from "model/tile/tileValue";

describe('tileValue.ts', () => {
    describe('isGentlemanTileValue', () => {
        test('is true for gentlemanTileValues', () => {
            for (const gentlemanTileValue of gentlemanTileValues) {
                expect(isGentlemanTileValue(gentlemanTileValue)).toBe(true);
            }
        });

        test('is false for nonGentlemanTileValues', () => {
            for (const suitedTileValue of suitedTileValues) {
                expect(isGentlemanTileValue(suitedTileValue)).toBe(false);
            }
            for (const dragonTileValue of dragonTileValues) {
                expect(isGentlemanTileValue(dragonTileValue)).toBe(false);
            }
            for (const windTileValue of windTileValues) {
                expect(isGentlemanTileValue(windTileValue)).toBe(false);
            }
            for (const seasonTileValue of seasonTileValues) {
                expect(isGentlemanTileValue(seasonTileValue)).toBe(false);
            }
        });
    });

    describe('isSeasonTileValue', () => {
        test('is true for seasonTileValues', () => {
            for (const seasonTileValue of seasonTileValues) {
                expect(isSeasonTileValue(seasonTileValue)).toBe(true);
            }
        });

        test('is false for nonGentlemanTileValues', () => {
            for (const suitedTileValue of suitedTileValues) {
                expect(isSeasonTileValue(suitedTileValue)).toBe(false);
            }
            for (const dragonTileValue of dragonTileValues) {
                expect(isSeasonTileValue(dragonTileValue)).toBe(false);
            }
            for (const windTileValue of windTileValues) {
                expect(isSeasonTileValue(windTileValue)).toBe(false);
            }
            for (const gentlemanTileValue of gentlemanTileValues) {
                expect(isSeasonTileValue(gentlemanTileValue)).toBe(false);
            }
        });
    });

    describe('isDragonTileValue', () => {
        test('is true for dragonTileValues', () => {
            for (const dragonTileValue of dragonTileValues) {
                expect(isDragonTileValue(dragonTileValue)).toBe(true);
            }
        });

        test('is false for nonDragonTileValues', () => {
            for (const suitedTileValue of suitedTileValues) {
                expect(isDragonTileValue(suitedTileValue)).toBe(false);
            }
            for (const windTileValue of windTileValues) {
                expect(isDragonTileValue(windTileValue)).toBe(false);
            }
            for (const gentlemanTileValue of gentlemanTileValues) {
                expect(isDragonTileValue(gentlemanTileValue)).toBe(false);
            }
            for (const seasonTileValue of seasonTileValues) {
                expect(isDragonTileValue(seasonTileValue)).toBe(false);
            }
        });
    });

    describe('isWindTileValue', () => {
        test('is true for windTileValues', () => {
            for (const windTileValue of windTileValues) {
                expect(isWindTileValue(windTileValue)).toBe(true);
            }
        });

        test('is false for nonDragonTileValues', () => {
            for (const suitedTileValue of suitedTileValues) {
                expect(isWindTileValue(suitedTileValue)).toBe(false);
            }
            for (const dragonTileValue of dragonTileValues) {
                expect(isWindTileValue(dragonTileValue)).toBe(false);
            }
            for (const gentlemanTileValue of gentlemanTileValues) {
                expect(isWindTileValue(gentlemanTileValue)).toBe(false);
            }
            for (const seasonTileValue of seasonTileValues) {
                expect(isWindTileValue(seasonTileValue)).toBe(false);
            }
        });
    });

    describe('isSuitedTileValue', () => {
        test('isSuitedTileValue is true for suitedTileValues', () => {
            for (const suitedTileValue of suitedTileValues) {
                expect(isSuitedTileValue(suitedTileValue)).toBe(true);
            }
        });

        test('isSuitedTileValue is false for nonSuitedTileValues', () => {
            for (const dragonTileValue of dragonTileValues) {
                expect(isSuitedTileValue(dragonTileValue)).toBe(false);
            }
            for (const windTileValue of windTileValues) {
                expect(isSuitedTileValue(windTileValue)).toBe(false);
            }
            for (const gentlemanTileValue of gentlemanTileValues) {
                expect(isSuitedTileValue(gentlemanTileValue)).toBe(false);
            }
            for (const seasonTileValue of seasonTileValues) {
                expect(isSuitedTileValue(seasonTileValue)).toBe(false);
            }
        });
    });

    describe('getNextSuitedTileValue', () => {
        test('has correct nextSuitedTileValues for values 1 - 8', () => {
            expect(getNextSuitedTileValue(SuitedTileValue.ONE)).toBe(SuitedTileValue.TWO);
            expect(getNextSuitedTileValue(SuitedTileValue.TWO)).toBe(SuitedTileValue.THREE);
            expect(getNextSuitedTileValue(SuitedTileValue.THREE)).toBe(SuitedTileValue.FOUR);
            expect(getNextSuitedTileValue(SuitedTileValue.FOUR)).toBe(SuitedTileValue.FIVE);
            expect(getNextSuitedTileValue(SuitedTileValue.FIVE)).toBe(SuitedTileValue.SIX);
            expect(getNextSuitedTileValue(SuitedTileValue.SIX)).toBe(SuitedTileValue.SEVEN);
            expect(getNextSuitedTileValue(SuitedTileValue.SEVEN)).toBe(SuitedTileValue.EIGHT);
            expect(getNextSuitedTileValue(SuitedTileValue.EIGHT)).toBe(SuitedTileValue.NINE);
        });

        test('is undefined for value 9', () => {
            expect(getNextSuitedTileValue(SuitedTileValue.NINE)).toBeUndefined();
        });
    });

    describe('isTerminalSuitedTileValue', () => {
        test('is true for 1 & 9', () => {
            expect(isTerminalSuitedTileValue(SuitedTileValue.ONE)).toBe(true);
            expect(isTerminalSuitedTileValue(SuitedTileValue.NINE)).toBe(true);
        });

        test('is false for 2 through 8', () => {
            expect(isTerminalSuitedTileValue(SuitedTileValue.TWO)).toBe(false);
            expect(isTerminalSuitedTileValue(SuitedTileValue.THREE)).toBe(false);
            expect(isTerminalSuitedTileValue(SuitedTileValue.FOUR)).toBe(false);
            expect(isTerminalSuitedTileValue(SuitedTileValue.FIVE)).toBe(false);
            expect(isTerminalSuitedTileValue(SuitedTileValue.SIX)).toBe(false);
            expect(isTerminalSuitedTileValue(SuitedTileValue.SEVEN)).toBe(false);
            expect(isTerminalSuitedTileValue(SuitedTileValue.EIGHT)).toBe(false);
        });
    });
});