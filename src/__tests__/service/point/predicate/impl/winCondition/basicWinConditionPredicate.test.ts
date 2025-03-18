import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { ONE_BAMBOO } from "common/deck";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { EARTHLY_HAND_PREDICATE, HEAVENLY_HAND_PREDICATE, LAST_OF_ITS_KIND_PREDICATE, 
    ROBBING_KONG_PREDICATE, SELF_DRAW_PREDICATE, WIN_BY_DOUBLE_FLOWER_PREDICATE, 
    WIN_BY_DOUBLE_KONG_PREDICATE, WIN_BY_FLOWER_PREDICATE, WIN_BY_KONG_PREDICATE, 
    WIN_BY_LAST_DISCARD_PREDICATE, WIN_BY_LAST_TILE_PREDICATE, WIN_BY_MIXED_DOUBLE_PREDICATE, 
    winByAnyDoubleReplacementPredicate, winByAnyReplacementSubPredicate } from "service/point/predicate/impl/winCondition/basicWinConditionPredicate";
import type { PointPredicateSingleSuccessResult } from "model/point/predicate/result/pointPredicateSingleSuccessResult";

jest.mock('model/hand/hk/winningHand/meldBasedWinningHand', () => {
    return {
        MeldBasedWinningHand: jest.fn().mockImplementation(() => {
            return {
                isSelfDrawn(): boolean {
                    return false;
                },

                get tiles(): ReadonlyArray<ReadonlyArray<SuitedOrHonorTile>> {
                    return [[ONE_BAMBOO]];
                }
            }
        })
    };
});

jest.mock('model/hand/hk/winningHand/specialWinningHand', () => {
    return {
        SpecialWinningHand: jest.fn().mockImplementation(() => {
            return {
                isSelfDrawn(): boolean {
                    return false;
                },

                get tiles(): ReadonlyArray<ReadonlyArray<SuitedOrHonorTile>> {
                    return [[ONE_BAMBOO]];
                }
            }
        })
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('basicWinConditionSubPredicate.ts', () => {
    const mockMeldBasedWinningHand = new MeldBasedWinningHand([], 0, ONE_BAMBOO, []);
    const mockSpecialWinningHand = new SpecialWinningHand([], 0, ONE_BAMBOO, false, false, [], SpecialWinningHandType.CUSTOM);    
    const basicWinContext = new WinContext.Builder().build();
    const westPrevailingEastSeat = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const westPrevailingWestSeat = new RoundContext(WindDirection.WEST, WindDirection.WEST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('self draw predicate', () => {
        test('hand is self drawn returns true', () => {
            jest.spyOn(mockMeldBasedWinningHand, 'isSelfDrawn').mockReturnValue(true);
            jest.spyOn(mockSpecialWinningHand, 'isSelfDrawn').mockReturnValue(true);

            const meldHandResult = SELF_DRAW_PREDICATE(mockMeldBasedWinningHand, basicWinContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = SELF_DRAW_PREDICATE(mockSpecialWinningHand, basicWinContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SELF_DRAW);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SELF_DRAW);
            expect(specialHandResult.success).toBe(true);
        });

        test('hand is not self drawn returns true', () => {
            jest.spyOn(mockMeldBasedWinningHand, 'isSelfDrawn').mockReturnValue(false);
            jest.spyOn(mockSpecialWinningHand, 'isSelfDrawn').mockReturnValue(false);

            const meldHandResult = SELF_DRAW_PREDICATE(mockMeldBasedWinningHand, basicWinContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = SELF_DRAW_PREDICATE(mockSpecialWinningHand, basicWinContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SELF_DRAW);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SELF_DRAW);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('last of its kind predicate', () => {
        test('mostRecentTileIsLastOfItsKind = true returns true', () => {
            const winContext = new WinContext.Builder().mostRecentTileIsLastOfItsKind(true).build();

            const meldHandResult = LAST_OF_ITS_KIND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = LAST_OF_ITS_KIND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.LAST_OF_ITS_KIND);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.LAST_OF_ITS_KIND);
            expect(specialHandResult.success).toBe(true);
        });

        test('mostRecentTileIsLastOfItsKind = false returns false', () => {
            const winContext = new WinContext.Builder().mostRecentTileIsLastOfItsKind(false).build();

            const meldHandResult = LAST_OF_ITS_KIND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = LAST_OF_ITS_KIND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.LAST_OF_ITS_KIND);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.LAST_OF_ITS_KIND);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('robbing kong predicate', () => {
        test('winByRobbingAKong = true returns true', () => {
            const winContext = new WinContext.Builder().winByRobbingAKong(true).build();

            const meldHandResult = ROBBING_KONG_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = ROBBING_KONG_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.ROBBING_KONG);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.ROBBING_KONG);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByRobbingAKong = false returns false', () => {
            const winContext = new WinContext.Builder().winByRobbingAKong(false).build();

            const meldHandResult = ROBBING_KONG_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = ROBBING_KONG_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.ROBBING_KONG);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.ROBBING_KONG);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by last tile predicate', () => {
        test('winByLastTileOnWall = true returns true', () => {
            const winContext = new WinContext.Builder().winByLastTileOnWall(true).build();

            const meldHandResult = WIN_BY_LAST_TILE_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_LAST_TILE_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_LAST_TILE);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_LAST_TILE);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByLastTileOnWall = false returns false', () => {
            const winContext = new WinContext.Builder().winByRobbingAKong(false).build();

            const meldHandResult = WIN_BY_LAST_TILE_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_LAST_TILE_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_LAST_TILE);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_LAST_TILE);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by last discard predicate', () => {
        test('winByLastDiscardOfGame = true returns true', () => {
            const winContext = new WinContext.Builder().winByLastDiscardOfGame(true).build();

            const meldHandResult = WIN_BY_LAST_DISCARD_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_LAST_DISCARD_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_LAST_DISCARD);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_LAST_DISCARD);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByLastDiscardOfGame = false returns false', () => {
            const winContext = new WinContext.Builder().winByLastDiscardOfGame(false).build();

            const meldHandResult = WIN_BY_LAST_DISCARD_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_LAST_DISCARD_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_LAST_DISCARD);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_LAST_DISCARD);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by kong predicate', () => {
        test('winByKongReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByKongReplacement(true).build();

            const meldHandResult = WIN_BY_KONG_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_KONG_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_KONG);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_KONG);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByKongOnKongReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByKongOnKongReplacement(true).build();

            const meldHandResult = WIN_BY_KONG_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_KONG_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_KONG);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_KONG);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByKongReplacement = false && winByKongOnKongReplacement returns false', () => {
            const winContext = new WinContext.Builder().winByKongReplacement(false).winByKongOnKongReplacement(false).build();

            const meldHandResult = WIN_BY_KONG_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_KONG_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_KONG);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_KONG);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by kong on kong predicate', () => {
        test('winByKongReplacement = true returns false', () => {
            const winContext = new WinContext.Builder().winByKongReplacement(true).build();

            const meldHandResult = WIN_BY_DOUBLE_KONG_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_DOUBLE_KONG_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_KONG);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_KONG);
            expect(specialHandResult.success).toBe(false);
        });

        test('winByKongOnKongReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByKongOnKongReplacement(true).build();

            const meldHandResult = WIN_BY_DOUBLE_KONG_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_DOUBLE_KONG_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_KONG);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_KONG);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByKongOnKongReplacement returns false', () => {
            const winContext = new WinContext.Builder().winByKongOnKongReplacement(false).build();

            const meldHandResult = WIN_BY_DOUBLE_KONG_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_DOUBLE_KONG_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_KONG);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_KONG);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by flower predicate', () => {
        test('winByFlowerReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByFlowerReplacement(true).build();

            const meldHandResult = WIN_BY_FLOWER_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_FLOWER_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_FLOWER);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_FLOWER);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByFlowerOnFlowerReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByFlowerOnFlowerReplacement(true).build();

            const meldHandResult = WIN_BY_FLOWER_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_FLOWER_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_FLOWER);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_FLOWER);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByFlowerReplacement = false && winByFlowerOnFlowerReplacement returns false', () => {
            const winContext = new WinContext.Builder().winByFlowerReplacement(false).winByFlowerOnFlowerReplacement(false).build();

            const meldHandResult = WIN_BY_FLOWER_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_FLOWER_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_FLOWER);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_FLOWER);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by flower on flower predicate', () => {
        test('winByFlowerReplacement = true returns false', () => {
            const winContext = new WinContext.Builder().winByFlowerReplacement(true).build();

            const meldHandResult = WIN_BY_DOUBLE_FLOWER_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_DOUBLE_FLOWER_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_FLOWER);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_FLOWER);
            expect(specialHandResult.success).toBe(false);
        });

        test('winByFlowerOnFlowerReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByFlowerOnFlowerReplacement(true).build();

            const meldHandResult = WIN_BY_DOUBLE_FLOWER_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_DOUBLE_FLOWER_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_FLOWER);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_FLOWER);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByFlowerOnFlowerReplacement returns false', () => {
            const winContext = new WinContext.Builder().winByFlowerOnFlowerReplacement(false).build();

            const meldHandResult = WIN_BY_DOUBLE_FLOWER_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_DOUBLE_FLOWER_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_FLOWER);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_DOUBLE_FLOWER);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by mixed double predicate', () => {
        test('winByMixedDoubleReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByMixedDoubleReplacement(true).build();

            const meldHandResult = WIN_BY_MIXED_DOUBLE_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_MIXED_DOUBLE_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_MIXED_DOUBLE_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_MIXED_DOUBLE_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByMixedDoubleReplacement = false returns false', () => {
            const winContext = new WinContext.Builder().winByMixedDoubleReplacement(false).build();

            const meldHandResult = WIN_BY_MIXED_DOUBLE_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = WIN_BY_MIXED_DOUBLE_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_MIXED_DOUBLE_REPLACEMENT);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.WIN_BY_MIXED_DOUBLE_REPLACEMENT);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by any replacement sub predicate', () => {

        test('winByKongReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByKongReplacement(true).build();

            const meldHandResult = winByAnyReplacementSubPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyReplacementSubPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByFlowerReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByFlowerReplacement(true).build();

            const meldHandResult = winByAnyReplacementSubPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyReplacementSubPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByKongOnKongReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByKongOnKongReplacement(true).build();

            const meldHandResult = winByAnyReplacementSubPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyReplacementSubPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByFlowerOnFlowerReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByFlowerOnFlowerReplacement(true).build();

            const meldHandResult = winByAnyReplacementSubPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyReplacementSubPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByMixedDoubleReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByMixedDoubleReplacement(true).build();

            const meldHandResult = winByAnyReplacementSubPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyReplacementSubPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByKongReplacement = false, winByKongOnKongReplacement = false, ' + 
            'winByFlowerReplacement = false, winByFlowerOnFlowerReplacement = false, ' + 
            'winByMixedDoubleReplacement = false returns false', () => {

            const winContext = new WinContext.Builder()
                .winByKongReplacement(false)
                .winByKongOnKongReplacement(false)
                .winByFlowerReplacement(false)
                .winByFlowerOnFlowerReplacement(false)
                .winByMixedDoubleReplacement(false)
                .build();

            const meldHandResult = winByAnyReplacementSubPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyReplacementSubPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                            
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_REPLACEMENT);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('win by any double replacement sub predicate', () => {

        test('winByKongReplacement = true returns false', () => {
            const winContext = new WinContext.Builder().winByKongReplacement(true).build();

            const meldHandResult = winByAnyDoubleReplacementPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyDoubleReplacementPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(specialHandResult.success).toBe(false);
        });

        test('winByFlowerReplacement = true returns false', () => {
            const winContext = new WinContext.Builder().winByFlowerReplacement(true).build();

            const meldHandResult = winByAnyDoubleReplacementPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyDoubleReplacementPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(specialHandResult.success).toBe(false);
        });

        test('winByKongOnKongReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByKongOnKongReplacement(true).build();

            const meldHandResult = winByAnyDoubleReplacementPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyDoubleReplacementPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByFlowerOnFlowerReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByFlowerOnFlowerReplacement(true).build();

            const meldHandResult = winByAnyDoubleReplacementPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyDoubleReplacementPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByMixedDoubleReplacement = true returns true', () => {
            const winContext = new WinContext.Builder().winByMixedDoubleReplacement(true).build();

            const meldHandResult = winByAnyDoubleReplacementPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyDoubleReplacementPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(specialHandResult.success).toBe(true);
        });

        test('winByKongOnKongReplacement = false, winByFlowerOnFlowerReplacement = false, ' + 
            'winByMixedDoubleReplacement = false returns false', () => {

            const winContext = new WinContext.Builder()
                .winByKongOnKongReplacement(false)
                .winByFlowerOnFlowerReplacement(false)
                .winByMixedDoubleReplacement(false)
                .build();

            const meldHandResult = winByAnyDoubleReplacementPredicate(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = winByAnyDoubleReplacementPredicate(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                            
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT);
            expect(specialHandResult.success).toBe(false);
        });
    });

    describe('earthly hand predicate', () => {
        test('winWithInitialHand = true and seat wind east returns true', () => {
            const winContext = new WinContext.Builder().winWithInitialHand(true).build();

            const meldHandResult = EARTHLY_HAND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = EARTHLY_HAND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.EARTHLY_HAND);
            expect(meldHandResult.success).toBe(true);
            expect((meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND) as PointPredicateSingleSuccessResult)
                .tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[ONE_BAMBOO]]);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST)?.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.EARTHLY_HAND);
            expect(specialHandResult.success).toBe(true);
            expect((specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND) as PointPredicateSingleSuccessResult)
                .tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[ONE_BAMBOO]]);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST)?.success).toBe(true);
        });

        test('winWithInitialHand = false and seat wind east returns false', () => {
            const winContext = new WinContext.Builder().winWithInitialHand(false).build();

            const meldHandResult = EARTHLY_HAND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = EARTHLY_HAND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.EARTHLY_HAND);
            expect(meldHandResult.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST)?.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.EARTHLY_HAND);
            expect(specialHandResult.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST)?.success).toBe(true);
        });

        test('winWithInitialHand = true and seat wind not east not returns false', () => {
            const winContext = new WinContext.Builder().winWithInitialHand(true).build();

            const meldHandResult = EARTHLY_HAND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingWestSeat, rootConfig);
            const specialHandResult = EARTHLY_HAND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingWestSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.EARTHLY_HAND);
            expect(meldHandResult.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(true);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST)?.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.EARTHLY_HAND);
            expect(specialHandResult.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(true);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST)?.success).toBe(false);
        });

        test('winWithInitialHand = false and seat wind not east not returns false', () => {
            const winContext = new WinContext.Builder().winWithInitialHand(false).build();

            const meldHandResult = EARTHLY_HAND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingWestSeat, rootConfig);
            const specialHandResult = EARTHLY_HAND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingWestSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.EARTHLY_HAND);
            expect(meldHandResult.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST)?.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.EARTHLY_HAND);
            expect(specialHandResult.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_SEAT_WIND_IS_EAST)?.success).toBe(false);
        });
    });

    describe('heavenly hand predicate', () => {
        test('winWithInitialHand = true and seat wind not east returns true', () => {
            const winContext = new WinContext.Builder().winWithInitialHand(true).build();

            const meldHandResult = HEAVENLY_HAND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingWestSeat, rootConfig);
            const specialHandResult = HEAVENLY_HAND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingWestSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.HEAVENLY_HAND);
            expect(meldHandResult.success).toBe(true);
            expect((meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND) as PointPredicateSingleSuccessResult)
                .tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[ONE_BAMBOO]]);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST)?.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.HEAVENLY_HAND);
            expect(specialHandResult.success).toBe(true);
            expect((specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND) as PointPredicateSingleSuccessResult)
                .tileDetail?.tilesThatSatisfyPredicate).toStrictEqual([[ONE_BAMBOO]]);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST)?.success).toBe(true);
        });

        test('winWithInitialHand = false and seat wind not east returns false', () => {
            const winContext = new WinContext.Builder().winWithInitialHand(false).build();

            const meldHandResult = HEAVENLY_HAND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingWestSeat, rootConfig);
            const specialHandResult = HEAVENLY_HAND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingWestSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.HEAVENLY_HAND);
            expect(meldHandResult.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST)?.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.HEAVENLY_HAND);
            expect(specialHandResult.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST)?.success).toBe(true);
        });

        test('winWithInitialHand = true and seat wind east returns false', () => {
            const winContext = new WinContext.Builder().winWithInitialHand(true).build();

            const meldHandResult = HEAVENLY_HAND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = HEAVENLY_HAND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.HEAVENLY_HAND);
            expect(meldHandResult.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(true);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST)?.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.HEAVENLY_HAND);
            expect(specialHandResult.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(true);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST)?.success).toBe(false);
        });

        test('winWithInitialHand = false and seat wind east returns false', () => {
            const winContext = new WinContext.Builder().winWithInitialHand(false).build();

            const meldHandResult = HEAVENLY_HAND_PREDICATE(mockMeldBasedWinningHand, winContext, westPrevailingEastSeat, rootConfig);
            const specialHandResult = HEAVENLY_HAND_PREDICATE(mockSpecialWinningHand, winContext, westPrevailingEastSeat, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.HEAVENLY_HAND);
            expect(meldHandResult.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(false);
            expect(meldHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST)?.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.HEAVENLY_HAND);
            expect(specialHandResult.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_WIN_WITH_INITIAL_HAND)?.success).toBe(false);
            expect(specialHandResult.getSubPredicateResult(PointPredicateID.SUBPREDICATE_NOT_SEAT_WIND_IS_EAST)?.success).toBe(false);
        });
    });
});