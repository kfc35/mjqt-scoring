import { BambooTile } from "model/tile/group/bambooTile";
import { CharacterTile } from "model/tile/group/characterTile";
import { CircleTile } from "model/tile/group/circleTile";
import { DragonTile } from "model/tile/group/dragonTile";
import { isFlowerTile } from "model/tile/group/flowerTile";
import { GentlemanTile, isGentlemanTile } from "model/tile/group/gentlemanTile";
import { isHonorTile } from "model/tile/group/honorTile";
import { isSeasonTile, SeasonTile } from "model/tile/group/seasonTile";
import { isSuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { isSuitedTile } from "model/tile/group/suitedTile";
import { WindTile } from "model/tile/group/windTile";
import type { Tile } from "model/tile/tile";
import { DragonTileValue, GentlemanTileValue, SeasonTileValue, SuitedTileValue, WindTileValue } from "model/tile/tileValue";

describe('tile.ts implementing classes', () => {
    describe('bamboo tile', () => {
        const bambooTile: Tile = new BambooTile(SuitedTileValue.FIVE);

        test('isSuitedTile is true', () => {
            expect(isSuitedTile(bambooTile)).toBe(true);
        });

        test('isHonorTile is false', () => {
            expect(isHonorTile(bambooTile)).toBe(false);
        });

        test('isSuitedOrHonorTile is true', () => {
            expect(isSuitedOrHonorTile(bambooTile)).toBe(true);
        });

        test('isGentlemanTile is false', () => {
            expect(isGentlemanTile(bambooTile)).toBe(false);
        });

        test('isSeasonTile is false', () => {
            expect(isSeasonTile(bambooTile)).toBe(false);
        });
        
        test('isFlowerTile is false', () => {
            expect(isFlowerTile(bambooTile)).toBe(false);
        });
    });

    describe('circle tile', () => {
        const circleTile: Tile = new CircleTile(SuitedTileValue.TWO);

        test('isSuitedTile is true', () => {
            expect(isSuitedTile(circleTile)).toBe(true);
        });

        test('isHonorTile is false', () => {
            expect(isHonorTile(circleTile)).toBe(false);
        });

        test('isSuitedOrHonorTile is true', () => {
            expect(isSuitedOrHonorTile(circleTile)).toBe(true);
        });

        test('isGentlemanTile is false', () => {
            expect(isGentlemanTile(circleTile)).toBe(false);
        });

        test('isSeasonTile is false', () => {
            expect(isSeasonTile(circleTile)).toBe(false);
        });
        
        test('isFlowerTile is false', () => {
            expect(isFlowerTile(circleTile)).toBe(false);
        });
    });

    describe('character tile', () => {
        const characterTile: Tile = new CharacterTile(SuitedTileValue.SEVEN);

        test('isSuitedTile is true', () => {
            expect(isSuitedTile(characterTile)).toBe(true);
        });

        test('isHonorTile is false', () => {
            expect(isHonorTile(characterTile)).toBe(false);
        });

        test('isSuitedOrHonorTile is true', () => {
            expect(isSuitedOrHonorTile(characterTile)).toBe(true);
        });

        test('isGentlemanTile is false', () => {
            expect(isGentlemanTile(characterTile)).toBe(false);
        });

        test('isSeasonTile is false', () => {
            expect(isSeasonTile(characterTile)).toBe(false);
        });
        
        test('isFlowerTile is false', () => {
            expect(isFlowerTile(characterTile)).toBe(false);
        });
    });

    describe('wind tile', () => {
        const windTile: Tile = new WindTile(WindTileValue.SOUTH);

        test('isSuitedTile is false', () => {
            expect(isSuitedTile(windTile)).toBe(false);
        });

        test('isHonorTile is true', () => {
            expect(isHonorTile(windTile)).toBe(true);
        });

        test('isSuitedOrHonorTile is true', () => {
            expect(isSuitedOrHonorTile(windTile)).toBe(true);
        });

        test('isGentlemanTile is false', () => {
            expect(isGentlemanTile(windTile)).toBe(false);
        });

        test('isSeasonTile is false', () => {
            expect(isSeasonTile(windTile)).toBe(false);
        });
        
        test('isFlowerTile is false', () => {
            expect(isFlowerTile(windTile)).toBe(false);
        });
    });

    describe('dragon tile', () => {
        const dragonTile: Tile = new DragonTile(DragonTileValue.WHITE);

        test('isSuitedTile is false', () => {
            expect(isSuitedTile(dragonTile)).toBe(false);
        });

        test('isHonorTile is true', () => {
            expect(isHonorTile(dragonTile)).toBe(true);
        });

        test('isSuitedOrHonorTile is true', () => {
            expect(isSuitedOrHonorTile(dragonTile)).toBe(true);
        });

        test('isGentlemanTile is false', () => {
            expect(isGentlemanTile(dragonTile)).toBe(false);
        });

        test('isSeasonTile is false', () => {
            expect(isSeasonTile(dragonTile)).toBe(false);
        });
        
        test('isFlowerTile is false', () => {
            expect(isFlowerTile(dragonTile)).toBe(false);
        });
    });

    describe('gentleman tile', () => {
        const gentlemanTile: Tile = new GentlemanTile(GentlemanTileValue.PLUM);

        test('isSuitedTile is false', () => {
            expect(isSuitedTile(gentlemanTile)).toBe(false);
        });

        test('isHonorTile is false', () => {
            expect(isHonorTile(gentlemanTile)).toBe(false);
        });

        test('isSuitedOrHonorTile is false', () => {
            expect(isSuitedOrHonorTile(gentlemanTile)).toBe(false);
        });

        test('isGentlemanTile is true', () => {
            expect(isGentlemanTile(gentlemanTile)).toBe(true);
        });

        test('isSeasonTile is false', () => {
            expect(isSeasonTile(gentlemanTile)).toBe(false);
        });
        
        test('isFlowerTile is true', () => {
            expect(isFlowerTile(gentlemanTile)).toBe(true);
        });
    });

    describe('season tile', () => {
        const seasonTile: Tile = new SeasonTile(SeasonTileValue.AUTUMN);

        test('isSuitedTile is false', () => {
            expect(isSuitedTile(seasonTile)).toBe(false);
        });

        test('isHonorTile is false', () => {
            expect(isHonorTile(seasonTile)).toBe(false);
        });

        test('isSuitedOrHonorTile is false', () => {
            expect(isSuitedOrHonorTile(seasonTile)).toBe(false);
        });

        test('isGentlemanTile is false', () => {
            expect(isGentlemanTile(seasonTile)).toBe(false);
        });

        test('isSeasonTile is true', () => {
            expect(isSeasonTile(seasonTile)).toBe(true);
        });
        
        test('isFlowerTile is true', () => {
            expect(isFlowerTile(seasonTile)).toBe(true);
        });
    });
});