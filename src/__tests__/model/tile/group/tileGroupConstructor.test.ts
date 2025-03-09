import { BambooTile } from "model/tile/group/bambooTile";
import { CharacterTile } from "model/tile/group/characterTile";
import { CircleTile } from "model/tile/group/circleTile";
import { DragonTile } from "model/tile/group/dragonTile";
import { WindTile } from "model/tile/group/windTile";
import { GentlemanTile } from "model/tile/group/gentlemanTile";
import { SeasonTile } from "model/tile/group/seasonTile";
import { suitedTileGroups } from "model/tile/group/suitedTile";
import { constructTile } from "model/tile/group/tileFactory";
import { TileGroup } from "model/tile/tileGroup";
import { dragonTileValues,gentlemanTileValues,seasonTileValues,suitedTileValues,windTileValues } from "model/tile/tileValue";
import { constructSuitedTile } from "model/tile/group/suitedTileConstructor";
import { constructHonorTile } from "model/tile/group/honorTileConstructor";

describe('tile.ts factory methods', () => {
    describe('constructTile', () => {
        describe('suited tiles - bamboo character circle', () => {
            test('throws when creating suited tile without suitedTileValue', () => {
                for (const suitedTileGroup of suitedTileGroups) {
                    for (const dragonTileValue of dragonTileValues) {
                        expect(() => {constructTile(suitedTileGroup, dragonTileValue)}).toThrow();
                    }
                    for (const windTileValue of windTileValues) {
                        expect(() => {constructTile(suitedTileGroup, windTileValue)}).toThrow();
                    }
                    for (const gentlemanTileValue of gentlemanTileValues) {
                        expect(() => {constructTile(suitedTileGroup, gentlemanTileValue)}).toThrow();
                    }
                    for (const seasonTileValue of seasonTileValues) {
                        expect(() => {constructTile(suitedTileGroup, seasonTileValue)}).toThrow();
                    }
                }
            });
            test('returns expected tile when creating suited tile with suitedTileValue', () => {
                for (const suitedTileGroup of suitedTileGroups) {
                    for (const suitedTileValue of suitedTileValues) {
                        const expectedTile = suitedTileGroup === TileGroup.BAMBOO ? new BambooTile(suitedTileValue) : 
                            suitedTileGroup === TileGroup.CHARACTER ? new CharacterTile(suitedTileValue) : 
                            new CircleTile(suitedTileValue);
                        expect(constructTile(suitedTileGroup, suitedTileValue)).toStrictEqual(expectedTile);
                    }
                }
            });
        });

        describe('dragon tiles', () => {
            test('throws when creating dragon tile without dragonTileValues', () => {
                for (const suitedTileValue of suitedTileValues) {
                    expect(() => {constructTile(TileGroup.DRAGON, suitedTileValue)}).toThrow();
                }
                for (const windTileValue of windTileValues) {
                    expect(() => {constructTile(TileGroup.DRAGON, windTileValue)}).toThrow();
                }
                for (const gentlemanTileValue of gentlemanTileValues) {
                    expect(() => {constructTile(TileGroup.DRAGON, gentlemanTileValue)}).toThrow();
                }
                for (const seasonTileValue of seasonTileValues) {
                    expect(() => {constructTile(TileGroup.DRAGON, seasonTileValue)}).toThrow();
                }
            });
            test('returns expected tile when creating dragon tiles with dragonTileValues', () => {
                for (const dragonTileValue of dragonTileValues) {
                    const expectedTile = new DragonTile(dragonTileValue);
                    expect(constructTile(TileGroup.DRAGON, dragonTileValue)).toStrictEqual(expectedTile);
                }
            });
        });

        describe('wind tiles', () => {
            test('throws when creating wind tile without windTileValues', () => {
                for (const suitedTileValue of suitedTileValues) {
                    expect(() => {constructTile(TileGroup.WIND, suitedTileValue)}).toThrow();
                }
                for (const dragonTileValue of dragonTileValues) {
                    expect(() => {constructTile(TileGroup.WIND, dragonTileValue)}).toThrow();
                }
                for (const gentlemanTileValue of gentlemanTileValues) {
                    expect(() => {constructTile(TileGroup.WIND, gentlemanTileValue)}).toThrow();
                }
                for (const seasonTileValue of seasonTileValues) {
                    expect(() => {constructTile(TileGroup.WIND, seasonTileValue)}).toThrow();
                }
            });
            test('returns expected tile when creating wind tile with windTileValues', () => {
                for (const windTileValue of windTileValues) {
                    const expectedTile = new WindTile(windTileValue);
                    expect(constructTile(TileGroup.WIND, windTileValue)).toStrictEqual(expectedTile);
                }
            });
        });

        describe('gentleman tiles', () => {
            test('throws when creating gentleman tile without gentlemanTileValues', () => {
                for (const suitedTileValue of suitedTileValues) {
                    expect(() => {constructTile(TileGroup.GENTLEMAN, suitedTileValue)}).toThrow();
                }
                for (const dragonTileValue of dragonTileValues) {
                    expect(() => {constructTile(TileGroup.GENTLEMAN, dragonTileValue)}).toThrow();
                }
                for (const windTileValue of windTileValues) {
                    expect(() => {constructTile(TileGroup.GENTLEMAN, windTileValue)}).toThrow();
                }
                for (const seasonTileValue of seasonTileValues) {
                    expect(() => {constructTile(TileGroup.GENTLEMAN, seasonTileValue)}).toThrow();
                }
            });
            test('returns expected tile when creating gentleman tile with gentlemanTileValues', () => {
                for (const gentlemanTileValue of gentlemanTileValues) {
                    const expectedTile = new GentlemanTile(gentlemanTileValue);
                    expect(constructTile(TileGroup.GENTLEMAN, gentlemanTileValue)).toStrictEqual(expectedTile);
                }
            });
        });

        describe('season tiles', () => {
            test('throws when creating seasonTile tile without seasonTileValues', () => {
                for (const suitedTileValue of suitedTileValues) {
                    expect(() => {constructTile(TileGroup.SEASON, suitedTileValue)}).toThrow();
                }
                for (const dragonTileValue of dragonTileValues) {
                    expect(() => {constructTile(TileGroup.SEASON, dragonTileValue)}).toThrow();
                }
                for (const windTileValue of windTileValues) {
                    expect(() => {constructTile(TileGroup.SEASON, windTileValue)}).toThrow();
                }
                for (const gentlemanTileValue of gentlemanTileValues) {
                    expect(() => {constructTile(TileGroup.SEASON, gentlemanTileValue)}).toThrow();
                }
            });
            test('returns expected tile when creating season tile with seasonTileValues', () => {
                for (const seasonTileValue of seasonTileValues) {
                    const expectedTile = new SeasonTile(seasonTileValue);
                    expect(constructTile(TileGroup.SEASON, seasonTileValue)).toStrictEqual(expectedTile);
                }
            });
        });
    });

    describe('constructSuitedTile', () => {
        test('returns expected tile when constructing suited tile with suitedtilevalue', () => {
            for (const suitedTileGroup of suitedTileGroups) {
                for (const suitedTileValue of suitedTileValues) {
                    const expectedTile = suitedTileGroup === TileGroup.BAMBOO ? new BambooTile(suitedTileValue) : 
                        suitedTileGroup === TileGroup.CHARACTER ? new CharacterTile(suitedTileValue) : 
                        new CircleTile(suitedTileValue);
                    expect(constructSuitedTile(suitedTileGroup, suitedTileValue)).toStrictEqual(expectedTile);
                }
            }
        });
    });

    describe('constructHonorTile', () => {
        test('constructs valid dragon tiles', () => {
            for (const dragonTileValue of dragonTileValues) {
                const expectedTile = new DragonTile(dragonTileValue);
                expect(constructHonorTile(TileGroup.DRAGON, dragonTileValue)).toStrictEqual(expectedTile);
            }
        });

        test('constructs valid wind tiles', () => {
            for (const windTileValue of windTileValues) {
                const expectedTile = new WindTile(windTileValue);
                expect(constructHonorTile(TileGroup.WIND, windTileValue)).toStrictEqual(expectedTile);
            }
        });

        test('cannot construct dragon tile with wind tile values', () => {
            for (const windTileValue of windTileValues) {
                expect(() => {constructHonorTile(TileGroup.DRAGON, windTileValue)}).toThrow();
            }
        });

        test('cannot construct wind tile with dragon tile values', () => {
            for (const dragonTileValue of dragonTileValues) {
                expect(() => {constructHonorTile(TileGroup.WIND, dragonTileValue)}).toThrow();
            }
        });
    });
});