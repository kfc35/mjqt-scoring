import { Tile } from "model/tile/tile";
import { BambooTile } from "model/tile/group/bambooTile";
import { CircleTile } from "model/tile/group/circleTile";
import { CharacterTile } from "model/tile/group/characterTile";
import { WindTile } from "model/tile/group/windTile";
import { DragonTile } from "model/tile/group/dragonTile";
import { GentlemanTile } from "model/tile/group/gentlemanTile";
import { SeasonTile } from "model/tile/group/seasonTile";
import { isHongKongTile } from "model/tile/hk/hongKongTile";
import { SuitedTileValue, WindTileValue, DragonTileValue, GentlemanTileValue, SeasonTileValue } from "model/tile/tileValue";

describe('hongKongTile.ts', () => {
    test('bamboo tile is hong kong tile', () => {
        const bambooTile: Tile = new BambooTile(SuitedTileValue.FIVE);

        expect(isHongKongTile(bambooTile)).toBe(true);
    });

    test('circle tile is hong kong tile', () => {
        const circleTile: Tile = new CircleTile(SuitedTileValue.TWO);

        expect(isHongKongTile(circleTile)).toBe(true);
    });

    describe('character tile', () => {
        const characterTile: Tile = new CharacterTile(SuitedTileValue.SEVEN);

        expect(isHongKongTile(characterTile)).toBe(true);
    });

    describe('wind tile', () => {
        const windTile: Tile = new WindTile(WindTileValue.SOUTH);

        expect(isHongKongTile(windTile)).toBe(true);
    });

    describe('dragon tile', () => {
        const dragonTile: Tile = new DragonTile(DragonTileValue.WHITE);

        expect(isHongKongTile(dragonTile)).toBe(true);
    });

    describe('gentleman tile', () => {
        const gentlemanTile: Tile = new GentlemanTile(GentlemanTileValue.PLUM);

        expect(isHongKongTile(gentlemanTile)).toBe(true);
    });

    describe('season tile', () => {
        const seasonTile: Tile = new SeasonTile(SeasonTileValue.AUTUMN);

        expect(isHongKongTile(seasonTile)).toBe(true);
    });
});