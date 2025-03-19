import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { ALL_GENTLEMEN_AND_SEASONS_PREDICATE, ALL_GENTLEMEN_PREDICATE, ALL_SEASONS_PREDICATE, NO_GENTLEMEN_OR_SEASONS_PREDICATE, PREVAILING_GENTLEMAN_PREDICATE, PREVAILING_SEASON_PREDICATE, SEAT_GENTLEMAN_PREDICATE, SEAT_SEASON_PREDICATE } from "service/point/predicate/impl/flower/flowerPredicate";
import { WindDirection } from "model/roundContext/windDirection";
import { AUTUMN_SEASON, BAMBOO_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, GENTLEMEN_TILES, ONE_BAMBOO, ORCHID_GENTLEMAN, PLUM_GENTLEMAN, SEASON_TILES, SPRING_SEASON, SUMMER_SEASON, WINTER_SEASON } from "common/deck";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { PointPredicateFailureResult } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { FlowerTile } from "model/tile/group/flowerTile";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { Tile } from "model/tile/tile";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";

jest.mock('model/hand/hk/winningHand/meldBasedWinningHand', () => {
    return {
        MeldBasedWinningHand: jest.fn().mockImplementation((_melds, _meldWithWinningTileIndex, _winningTile, inputFlowerTiles: FlowerTile[]) => {
            return {
                get flowerTiles(): FlowerTile[] {
                    return inputFlowerTiles;
                }
            }
        })
    };
});

jest.mock('model/hand/hk/winningHand/specialWinningHand', () => {
    return {
        SpecialWinningHand: jest.fn().mockImplementation((_tiles, _tilesIndexWithWinningTile, _winningTile, _winningTileIsPartOfPair, _isSelfDraw, inputFlowerTiles: FlowerTile[]) => {
            return {
                get flowerTiles(): FlowerTile[] {
                    return inputFlowerTiles;
                }
            }
        })
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('flowerPredicate.ts', () => {
    let mockMeldBasedWinningHand: MeldBasedWinningHand;
    let mockSpecialWinningHand: SpecialWinningHand;
    
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    function runMeldBasedSuccessTest(inputFlowerTiles: FlowerTile[], predicate: PointPredicate<WinningHand>, 
        expectedPointPredicateId: PointPredicateID, expectedTilesThatSatisfyPredicate: Tile[][]) {
        mockMeldBasedWinningHand = new MeldBasedWinningHand([], 0, ONE_BAMBOO, inputFlowerTiles);

        const meldBasedResult = predicate(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(meldBasedResult.pointPredicateId).toBe(expectedPointPredicateId);
        expect(meldBasedResult.success).toBe(true);
        expect(meldBasedResult instanceof PointPredicateSingleSuccessResult).toBe(true);
        const mbr: PointPredicateSingleSuccessResult = meldBasedResult as PointPredicateSingleSuccessResult;
        expect(mbr.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual(expectedTilesThatSatisfyPredicate);
    }

    function runSpecialSuccessTest(inputFlowerTiles: FlowerTile[], predicate: PointPredicate<WinningHand>, 
        expectedPointPredicateId: PointPredicateID,expectedTilesThatSatisfyPredicate: Tile[][]) {
        mockSpecialWinningHand = new SpecialWinningHand([], 0, ONE_BAMBOO, false, false, inputFlowerTiles, SpecialWinningHandType.CUSTOM);

        const specialResult = predicate(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(specialResult.pointPredicateId).toBe(expectedPointPredicateId);
        expect(specialResult.success).toBe(true);
        expect(specialResult instanceof PointPredicateSingleSuccessResult).toBe(true);
        const sr: PointPredicateSingleSuccessResult = specialResult as PointPredicateSingleSuccessResult;
        expect(sr.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual(expectedTilesThatSatisfyPredicate);
    }

    function runMeldBasedFailureTest(inputFlowerTiles: FlowerTile[], predicate: PointPredicate<WinningHand>, expectedPointPredicateId: PointPredicateID,
        expectedTilesThatFailPredicate: Tile[][], expectedTilesThatAreMissingToSatisfyPredicate: Tile[][]) {
        mockMeldBasedWinningHand = new MeldBasedWinningHand([], 0, ONE_BAMBOO, inputFlowerTiles);

        const meldBasedResult = predicate(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);

        expect(meldBasedResult.pointPredicateId).toBe(expectedPointPredicateId);
        expect(meldBasedResult.success).toBe(false);
        expect(meldBasedResult instanceof PointPredicateFailureResult).toBe(true);
        const mbr: PointPredicateFailureResult = meldBasedResult as PointPredicateFailureResult;
        expect(mbr.tileDetail?.tilesThatFailPredicate).toStrictEqual(expectedTilesThatFailPredicate);
        expect(mbr.tileDetail?.tilesThatAreMissingToSatisfyPredicate).toStrictEqual(expectedTilesThatAreMissingToSatisfyPredicate);
    }

    function runSpecialFailureTest(inputFlowerTiles: FlowerTile[], predicate: PointPredicate<WinningHand>, expectedPointPredicateId: PointPredicateID,
        expectedTilesThatFailPredicate: Tile[][], expectedTilesThatAreMissingToSatisfyPredicate: Tile[][]) {
        mockSpecialWinningHand = new SpecialWinningHand([], 0, ONE_BAMBOO, false, false, inputFlowerTiles, SpecialWinningHandType.CUSTOM);

        const specialResult = predicate(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);

        expect(specialResult.pointPredicateId).toBe(expectedPointPredicateId);
        expect(specialResult.success).toBe(false);
        expect(specialResult instanceof PointPredicateFailureResult).toBe(true);
        const sr: PointPredicateFailureResult = specialResult as PointPredicateFailureResult;
        expect(sr.tileDetail?.tilesThatFailPredicate).toStrictEqual(expectedTilesThatFailPredicate);
        expect(sr.tileDetail?.tilesThatAreMissingToSatisfyPredicate).toStrictEqual(expectedTilesThatAreMissingToSatisfyPredicate);
    }

    describe('no gentlmen or season predicate', () => {
        test('hand without flower tiles returns true', () => {
            runMeldBasedSuccessTest([], NO_GENTLEMEN_OR_SEASONS_PREDICATE, PointPredicateID.NO_GENTLEMEN_OR_SEASONS, []);
            runSpecialSuccessTest([], NO_GENTLEMEN_OR_SEASONS_PREDICATE, PointPredicateID.NO_GENTLEMEN_OR_SEASONS, []);
        });

        test('hand with any flower tile returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], NO_GENTLEMEN_OR_SEASONS_PREDICATE, PointPredicateID.NO_GENTLEMEN_OR_SEASONS, [[BAMBOO_GENTLEMAN]], []);
            runSpecialFailureTest([SUMMER_SEASON], NO_GENTLEMEN_OR_SEASONS_PREDICATE, PointPredicateID.NO_GENTLEMEN_OR_SEASONS, [[SUMMER_SEASON]], []);
        });
    });

    describe('seat gentleman predicate', () => {
        test('hand with seat gentleman returns true', () => {
            // the seat gentleman for east is plum
            runMeldBasedSuccessTest([PLUM_GENTLEMAN], SEAT_GENTLEMAN_PREDICATE, PointPredicateID.SEAT_GENTLEMAN, [[PLUM_GENTLEMAN]]);
            runSpecialSuccessTest([PLUM_GENTLEMAN], SEAT_GENTLEMAN_PREDICATE, PointPredicateID.SEAT_GENTLEMAN, [[PLUM_GENTLEMAN]]);
        });

        test('hand without seat gentleman returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], SEAT_GENTLEMAN_PREDICATE, PointPredicateID.SEAT_GENTLEMAN, [], [[PLUM_GENTLEMAN]]);
            runSpecialFailureTest([SUMMER_SEASON], SEAT_GENTLEMAN_PREDICATE, PointPredicateID.SEAT_GENTLEMAN, [], [[PLUM_GENTLEMAN]]);
        });
    });

    describe('seat season predicate', () => {
        test('hand with seat season returns true', () => {
            // the seat season for east is spring
            runMeldBasedSuccessTest([SPRING_SEASON], SEAT_SEASON_PREDICATE, PointPredicateID.SEAT_SEASON, [[SPRING_SEASON]]);
            runSpecialSuccessTest([SPRING_SEASON], SEAT_SEASON_PREDICATE, PointPredicateID.SEAT_SEASON, [[SPRING_SEASON]]);
        });

        test('hand without seat season returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], SEAT_SEASON_PREDICATE, PointPredicateID.SEAT_SEASON, [], [[SPRING_SEASON]]);
            runSpecialFailureTest([SUMMER_SEASON], SEAT_SEASON_PREDICATE, PointPredicateID.SEAT_SEASON, [], [[SPRING_SEASON]]);
        });
    });

    describe('prevailing gentleman predicate', () => {
        test('hand with prevailing gentleman returns true', () => {
            // the prevailing gentleman for west is chrysanthemum
            runMeldBasedSuccessTest([CHRYSANTHEMUM_GENTLEMAN], PREVAILING_GENTLEMAN_PREDICATE, PointPredicateID.PREVAILING_GENTLEMAN, [[CHRYSANTHEMUM_GENTLEMAN]]);
            runSpecialSuccessTest([CHRYSANTHEMUM_GENTLEMAN], PREVAILING_GENTLEMAN_PREDICATE, PointPredicateID.PREVAILING_GENTLEMAN, [[CHRYSANTHEMUM_GENTLEMAN]]);
        });

        test('hand without prevailing gentleman returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], PREVAILING_GENTLEMAN_PREDICATE, PointPredicateID.PREVAILING_GENTLEMAN, [], [[CHRYSANTHEMUM_GENTLEMAN]]);
            runSpecialFailureTest([SUMMER_SEASON], PREVAILING_GENTLEMAN_PREDICATE, PointPredicateID.PREVAILING_GENTLEMAN, [], [[CHRYSANTHEMUM_GENTLEMAN]]);
        });
    });

    describe('prevailing season predicate', () => {
        test('hand with prevailing season returns true', () => {
            // the prevailing season for west is autumn
            runMeldBasedSuccessTest([AUTUMN_SEASON], PREVAILING_SEASON_PREDICATE, PointPredicateID.PREVAILING_SEASON, [[AUTUMN_SEASON]]);
            runSpecialSuccessTest([AUTUMN_SEASON], PREVAILING_SEASON_PREDICATE, PointPredicateID.PREVAILING_SEASON, [[AUTUMN_SEASON]]);
        });

        test('hand without prevailing season returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], PREVAILING_SEASON_PREDICATE, PointPredicateID.PREVAILING_SEASON, [], [[AUTUMN_SEASON]]);
            runSpecialFailureTest([SUMMER_SEASON], PREVAILING_SEASON_PREDICATE, PointPredicateID.PREVAILING_SEASON, [], [[AUTUMN_SEASON]]);
        });
    });

    describe('all gentlemen predicate', () => {
        test('hand with all gentlemen returns true', () => {
            runMeldBasedSuccessTest([...GENTLEMEN_TILES], ALL_GENTLEMEN_PREDICATE, PointPredicateID.ALL_GENTLEMEN, [[...GENTLEMEN_TILES]]);
            runSpecialSuccessTest([...GENTLEMEN_TILES], ALL_GENTLEMEN_PREDICATE, PointPredicateID.ALL_GENTLEMEN, [[...GENTLEMEN_TILES]]);
        });

        test('hand without all gentlemen returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], ALL_GENTLEMEN_PREDICATE, PointPredicateID.ALL_GENTLEMEN, [], [[PLUM_GENTLEMAN, ORCHID_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN]]);
            runSpecialFailureTest([SUMMER_SEASON], ALL_GENTLEMEN_PREDICATE, PointPredicateID.ALL_GENTLEMEN, [], [[...GENTLEMEN_TILES]]);
        });
    });

    describe('all season predicate', () => {
        test('hand with all seasons returns true', () => {
            runMeldBasedSuccessTest([...SEASON_TILES], ALL_SEASONS_PREDICATE, PointPredicateID.ALL_SEASONS, [[...SEASON_TILES]]);
            runSpecialSuccessTest([...SEASON_TILES], ALL_SEASONS_PREDICATE, PointPredicateID.ALL_SEASONS, [[...SEASON_TILES]]);
        });

        test('hand without all seasons returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], ALL_SEASONS_PREDICATE, PointPredicateID.ALL_SEASONS, [], [[...SEASON_TILES]]);
            runSpecialFailureTest([SUMMER_SEASON], ALL_SEASONS_PREDICATE, PointPredicateID.ALL_SEASONS, [], [[SPRING_SEASON, AUTUMN_SEASON, WINTER_SEASON]]);
        });
    });

    describe('all gentlemen and season predicate', () => {
        test('hand with all gentlemen and seasons returns true', () => {
            const inputFlowerTiles = [...GENTLEMEN_TILES, ...SEASON_TILES];
            mockMeldBasedWinningHand = new MeldBasedWinningHand([], 0, ONE_BAMBOO, inputFlowerTiles);
            mockSpecialWinningHand = new SpecialWinningHand([], 0, ONE_BAMBOO, false, false, inputFlowerTiles, SpecialWinningHandType.CUSTOM);

            const meldBasedResult = ALL_GENTLEMEN_AND_SEASONS_PREDICATE(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);
            const specialResult = ALL_GENTLEMEN_AND_SEASONS_PREDICATE(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);
        
            expect(meldBasedResult.pointPredicateId).toBe(PointPredicateID.ALL_GENTLEMAN_AND_SEASONS);
            expect(specialResult.pointPredicateId).toBe(PointPredicateID.ALL_GENTLEMAN_AND_SEASONS);
            expect(meldBasedResult.success).toBe(true);
            expect(specialResult.success).toBe(true);
        });

        test('hand without all gentlemen and seasons returns false', () => {
            mockMeldBasedWinningHand = new MeldBasedWinningHand([], 0, ONE_BAMBOO, [BAMBOO_GENTLEMAN]);
            mockSpecialWinningHand = new SpecialWinningHand([], 0, ONE_BAMBOO, false, false, [SPRING_SEASON, SUMMER_SEASON, AUTUMN_SEASON, WINTER_SEASON], SpecialWinningHandType.CUSTOM);

            const meldBasedResult = ALL_GENTLEMEN_AND_SEASONS_PREDICATE(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);
            const specialResult = ALL_GENTLEMEN_AND_SEASONS_PREDICATE(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);
        
            expect(meldBasedResult.pointPredicateId).toBe(PointPredicateID.ALL_GENTLEMAN_AND_SEASONS);
            expect(specialResult.pointPredicateId).toBe(PointPredicateID.ALL_GENTLEMAN_AND_SEASONS);
            expect(meldBasedResult.success).toBe(false);
            expect(specialResult.success).toBe(false);
            expect(meldBasedResult.getSubPredicateResult(PointPredicateID.ALL_GENTLEMEN)?.success).toBe(false);
            expect(meldBasedResult.getSubPredicateResult(PointPredicateID.ALL_SEASONS)?.success).toBe(false);
            expect(specialResult.getSubPredicateResult(PointPredicateID.ALL_GENTLEMEN)?.success).toBe(false);
            expect(specialResult.getSubPredicateResult(PointPredicateID.ALL_SEASONS)?.success).toBe(true);
        });
    });
});