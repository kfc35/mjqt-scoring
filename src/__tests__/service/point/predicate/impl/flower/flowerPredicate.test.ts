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

jest.mock('model/hand/hk/winningHand/meldBasedWinningHand', () => {
    return {
        MeldBasedWinningHand: jest.fn().mockImplementation(() => {
            return {
                get flowerTiles() {
                    return undefined;
                }
            }
        })
    };
});

jest.mock('model/hand/hk/winningHand/specialWinningHand', () => {
    return {
        SpecialWinningHand: jest.fn().mockImplementation(() => {
            return {
                get flowerTiles() {
                    return undefined;
                }
            }
        })
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('flowerPredicate.ts', () => {
    const mockMeldBasedWinningHand = new MeldBasedWinningHand([], 0, ONE_BAMBOO, []);
    const mockSpecialWinningHand = new SpecialWinningHand([], 0, ONE_BAMBOO, false, false, [], SpecialWinningHandType.CUSTOM);
    
    const basicWinContext = new WinContext.Builder().build();
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    function runMeldBasedSuccessTest(inputFlowerTiles: FlowerTile[], predicate: PointPredicate<WinningHand>, expectedTilesThatSatisfyPredicate: Tile[][]) {
        jest.spyOn(mockMeldBasedWinningHand, 'flowerTiles', 'get').mockReturnValue(inputFlowerTiles);

        const meldBasedResult = predicate(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(meldBasedResult.success).toBe(true);
        expect(meldBasedResult instanceof PointPredicateSingleSuccessResult).toBe(true);
        const mbr: PointPredicateSingleSuccessResult = meldBasedResult as PointPredicateSingleSuccessResult;
        expect(mbr.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual(expectedTilesThatSatisfyPredicate);
    }

    function runSpecialSuccessTest(inputFlowerTiles: FlowerTile[], predicate: PointPredicate<WinningHand>, expectedTilesThatSatisfyPredicate: Tile[][]) {
        jest.spyOn(mockSpecialWinningHand, 'flowerTiles', 'get').mockReturnValue(inputFlowerTiles);

        const specialResult = predicate(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);
        
        expect(specialResult.success).toBe(true);
        expect(specialResult instanceof PointPredicateSingleSuccessResult).toBe(true);
        const sr: PointPredicateSingleSuccessResult = specialResult as PointPredicateSingleSuccessResult;
        expect(sr.tileDetail?.tilesThatSatisfyPredicate).toStrictEqual(expectedTilesThatSatisfyPredicate);
    }

    function runMeldBasedFailureTest(inputFlowerTiles: FlowerTile[], predicate: PointPredicate<WinningHand>, 
        expectedTilesThatFailPredicate: Tile[][], expectedTilesThatAreMissingToSatisfyPredicate: Tile[][]) {

        jest.spyOn(mockMeldBasedWinningHand, 'flowerTiles', 'get').mockReturnValue(inputFlowerTiles);

        const meldBasedResult = predicate(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);

        expect(meldBasedResult.success).toBe(false);
        expect(meldBasedResult instanceof PointPredicateFailureResult).toBe(true);
        const mbr: PointPredicateFailureResult = meldBasedResult as PointPredicateFailureResult;
        expect(mbr.tileDetail?.tilesThatFailPredicate).toStrictEqual(expectedTilesThatFailPredicate);
        expect(mbr.tileDetail?.tilesThatAreMissingToSatisfyPredicate).toStrictEqual(expectedTilesThatAreMissingToSatisfyPredicate);
    }

    function runSpecialFailureTest(inputFlowerTiles: FlowerTile[], predicate: PointPredicate<WinningHand>, 
        expectedTilesThatFailPredicate: Tile[][], expectedTilesThatAreMissingToSatisfyPredicate: Tile[][]) {

        jest.spyOn(mockSpecialWinningHand, 'flowerTiles', 'get').mockReturnValue(inputFlowerTiles);

        const specialResult = predicate(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);

        expect(specialResult.success).toBe(false);
        expect(specialResult instanceof PointPredicateFailureResult).toBe(true);
        const sr: PointPredicateFailureResult = specialResult as PointPredicateFailureResult;
        expect(sr.tileDetail?.tilesThatFailPredicate).toStrictEqual(expectedTilesThatFailPredicate);
        expect(sr.tileDetail?.tilesThatAreMissingToSatisfyPredicate).toStrictEqual(expectedTilesThatAreMissingToSatisfyPredicate);
    }

    describe('no gentlmen or season predicate', () => {
        test('hand without flower tiles returns true', () => {
            runMeldBasedSuccessTest([], NO_GENTLEMEN_OR_SEASONS_PREDICATE, []);
            runSpecialSuccessTest([], NO_GENTLEMEN_OR_SEASONS_PREDICATE, []);
        });

        test('hand with any flower tile returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], NO_GENTLEMEN_OR_SEASONS_PREDICATE, [[BAMBOO_GENTLEMAN]], []);
            runSpecialFailureTest([SUMMER_SEASON], NO_GENTLEMEN_OR_SEASONS_PREDICATE, [[SUMMER_SEASON]], []);
        });
    });

    describe('seat gentleman predicate', () => {
        test('hand with seat gentleman returns true', () => {
            // the seat gentleman for east is plum
            runMeldBasedSuccessTest([PLUM_GENTLEMAN], SEAT_GENTLEMAN_PREDICATE, [[PLUM_GENTLEMAN]]);
            runSpecialSuccessTest([PLUM_GENTLEMAN], SEAT_GENTLEMAN_PREDICATE, [[PLUM_GENTLEMAN]]);
        });

        test('hand without seat gentleman returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], SEAT_GENTLEMAN_PREDICATE, [], [[PLUM_GENTLEMAN]]);
            runSpecialFailureTest([SUMMER_SEASON], SEAT_GENTLEMAN_PREDICATE, [], [[PLUM_GENTLEMAN]]);
        });
    });

    describe('seat season predicate', () => {
        test('hand with seat season returns true', () => {
            // the seat season for east is spring
            runMeldBasedSuccessTest([SPRING_SEASON], SEAT_SEASON_PREDICATE, [[SPRING_SEASON]]);
            runSpecialSuccessTest([SPRING_SEASON], SEAT_SEASON_PREDICATE, [[SPRING_SEASON]]);
        });

        test('hand without seat season returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], SEAT_SEASON_PREDICATE, [], [[SPRING_SEASON]]);
            runSpecialFailureTest([SUMMER_SEASON], SEAT_SEASON_PREDICATE, [], [[SPRING_SEASON]]);
        });
    });

    describe('prevailing gentleman predicate', () => {
        test('hand with prevailing gentleman returns true', () => {
            // the prevailing gentleman for west is chrysanthemum
            runMeldBasedSuccessTest([CHRYSANTHEMUM_GENTLEMAN], PREVAILING_GENTLEMAN_PREDICATE, [[CHRYSANTHEMUM_GENTLEMAN]]);
            runSpecialSuccessTest([CHRYSANTHEMUM_GENTLEMAN], PREVAILING_GENTLEMAN_PREDICATE, [[CHRYSANTHEMUM_GENTLEMAN]]);
        });

        test('hand without prevailing gentleman returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], PREVAILING_GENTLEMAN_PREDICATE, [], [[CHRYSANTHEMUM_GENTLEMAN]]);
            runSpecialFailureTest([SUMMER_SEASON], PREVAILING_GENTLEMAN_PREDICATE, [], [[CHRYSANTHEMUM_GENTLEMAN]]);
        });
    });

    describe('prevailing season predicate', () => {
        test('hand with prevailing season returns true', () => {
            // the prevailing season for west is autumn
            runMeldBasedSuccessTest([AUTUMN_SEASON], PREVAILING_SEASON_PREDICATE, [[AUTUMN_SEASON]]);
            runSpecialSuccessTest([AUTUMN_SEASON], PREVAILING_SEASON_PREDICATE, [[AUTUMN_SEASON]]);
        });

        test('hand without prevailing season returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], PREVAILING_SEASON_PREDICATE, [], [[AUTUMN_SEASON]]);
            runSpecialFailureTest([SUMMER_SEASON], PREVAILING_SEASON_PREDICATE, [], [[AUTUMN_SEASON]]);
        });
    });

    describe('all gentlemen predicate', () => {
        test('hand with all gentlemen returns true', () => {
            runMeldBasedSuccessTest([...GENTLEMEN_TILES], ALL_GENTLEMEN_PREDICATE, [[...GENTLEMEN_TILES]]);
            runSpecialSuccessTest([...GENTLEMEN_TILES], ALL_GENTLEMEN_PREDICATE, [[...GENTLEMEN_TILES]]);
        });

        test('hand without all gentlemen returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], ALL_GENTLEMEN_PREDICATE, [], [[PLUM_GENTLEMAN, ORCHID_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN]]);
            runSpecialFailureTest([SUMMER_SEASON], ALL_GENTLEMEN_PREDICATE, [], [[...GENTLEMEN_TILES]]);
        });
    });

    describe('all season predicate', () => {
        test('hand with all seasons returns true', () => {
            runMeldBasedSuccessTest([...SEASON_TILES], ALL_SEASONS_PREDICATE, [[...SEASON_TILES]]);
            runSpecialSuccessTest([...SEASON_TILES], ALL_SEASONS_PREDICATE, [[...SEASON_TILES]]);
        });

        test('hand without all seasons returns false', () => {
            runMeldBasedFailureTest([BAMBOO_GENTLEMAN], ALL_SEASONS_PREDICATE, [], [[...SEASON_TILES]]);
            runSpecialFailureTest([SUMMER_SEASON], ALL_SEASONS_PREDICATE, [], [[SPRING_SEASON, AUTUMN_SEASON, WINTER_SEASON]]);
        });
    });

    describe('all gentlemen and season predicate', () => {
        test('hand with all gentlemen and seasons returns true', () => {
            jest.spyOn(mockMeldBasedWinningHand, 'flowerTiles', 'get').mockReturnValue([...GENTLEMEN_TILES, ...SEASON_TILES]);
            jest.spyOn(mockSpecialWinningHand, 'flowerTiles', 'get').mockReturnValue([...GENTLEMEN_TILES, ...SEASON_TILES]);

            const meldBasedResult = ALL_GENTLEMEN_AND_SEASONS_PREDICATE(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);
            const specialResult = ALL_GENTLEMEN_AND_SEASONS_PREDICATE(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);
        
            expect(meldBasedResult.success).toBe(true);
            expect(specialResult.success).toBe(true);
        });

        test('hand without all gentlemen and seasons returns false', () => {
            jest.spyOn(mockMeldBasedWinningHand, 'flowerTiles', 'get').mockReturnValue([BAMBOO_GENTLEMAN]);
            jest.spyOn(mockSpecialWinningHand, 'flowerTiles', 'get').mockReturnValue([SUMMER_SEASON]);

            const meldBasedResult = ALL_GENTLEMEN_AND_SEASONS_PREDICATE(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);
            const specialResult = ALL_GENTLEMEN_AND_SEASONS_PREDICATE(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);
        
            expect(meldBasedResult.success).toBe(false);
            expect(specialResult.success).toBe(false);
        });
    });
});