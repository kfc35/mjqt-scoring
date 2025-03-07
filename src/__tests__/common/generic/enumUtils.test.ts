import { getEnumKeys } from "common/generic/enumUtils";
import { SuitedTileValue } from "model/tile/tileValue";

describe('enumUtils.ts', () => {
    describe('getEnumKeys', () => {
        test('returns enum keys for enum', () => {
            expect(getEnumKeys(SuitedTileValue)).toStrictEqual(
                ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"]);
        });
    });
});