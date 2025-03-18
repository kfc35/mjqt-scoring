import { FIVE_CHARACTER, FOUR_CHARACTER, SIX_CHARACTER } from "common/deck";
import { MostRecentTileContext } from "model/hand/mostRecentTile/mostRecentTileContext";
import { CharacterTile } from "model/tile/group/characterTile";
import { SuitedTileValue } from "model/tile/tileValue";
import { Pong } from "model/meld/pong";
import { Chow } from "model/meld/chow";
import { Kong } from "model/meld/kong";

describe('mostRecentTileContext.ts', () => {
    describe('constructor with isSelfDrawnFlag', () => {
        test('has fields set as expected', () => {
            const contextNotSelfDrawn = new MostRecentTileContext(FIVE_CHARACTER, false);
            expect(contextNotSelfDrawn.tile).toStrictEqual(new CharacterTile(SuitedTileValue.FIVE));
            expect(contextNotSelfDrawn.isSelfDrawn).toBe(false);
            expect(contextNotSelfDrawn.userSpecifiedMeld).toBeUndefined();

            const contextSelfDrawn = new MostRecentTileContext(FIVE_CHARACTER, true);
            expect(contextSelfDrawn.tile).toStrictEqual(new CharacterTile(SuitedTileValue.FIVE));
            expect(contextSelfDrawn.isSelfDrawn).toBe(true);
            expect(contextSelfDrawn.userSpecifiedMeld).toBeUndefined();
        });
    });

    describe('constructor with userSpecifiedMeld', () => {
        test('throws when meld does not contain tile', () => {
            expect(() => {new MostRecentTileContext(FIVE_CHARACTER, new Pong(SIX_CHARACTER))})
                .toThrow();
        });

        test('throws when meld is a kong', () => {
            expect(() => {new MostRecentTileContext(FIVE_CHARACTER, new Kong(SIX_CHARACTER))})
            .toThrow();
        });

        test('has fields set as expected', () => {
            const contextNotSelfDrawn = new MostRecentTileContext(FIVE_CHARACTER, new Pong(FIVE_CHARACTER, true));
            expect(contextNotSelfDrawn.tile).toStrictEqual(new CharacterTile(SuitedTileValue.FIVE));
            expect(contextNotSelfDrawn.isSelfDrawn).toBe(false);
            expect(contextNotSelfDrawn.userSpecifiedMeld).toStrictEqual(new Pong(FIVE_CHARACTER, true));

            const contextSelfDrawn = new MostRecentTileContext(FIVE_CHARACTER, new Chow([FOUR_CHARACTER, FIVE_CHARACTER, SIX_CHARACTER], false));
            expect(contextSelfDrawn.tile).toStrictEqual(new CharacterTile(SuitedTileValue.FIVE));
            expect(contextSelfDrawn.isSelfDrawn).toBe(true);
            expect(contextSelfDrawn.userSpecifiedMeld).toStrictEqual(new Chow([FOUR_CHARACTER, FIVE_CHARACTER, SIX_CHARACTER], false));
        });
    });
});