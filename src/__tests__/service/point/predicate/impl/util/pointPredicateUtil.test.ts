import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { ONE_BAMBOO, TWO_BAMBOO} from "common/deck";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { PointPredicateSingleSuccessResult, PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { createPointPredicateRouter, createPointPredicateRouterWithAutoFailSpecialPredicate, createPointPredicateRouterWithAutoSuccessSpecialPredicate, createPPResultBasedOnBooleanFlagWithTileDetail } from "service/point/predicate/impl/util/pointPredicateUtil";
import { PointPredicateFailureResult, PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult";
import { PointPredicateSuccessResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";
import { PointPredicateFailureResultTileDetailBuilder } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";

jest.mock('model/hand/hk/winningHand/meldBasedWinningHand', () => {
    return {
        MeldBasedWinningHand: jest.fn().mockImplementation(() => {
            const ptype = Object.create(MeldBasedWinningHand.prototype) as MeldBasedWinningHand;
            return Object.assign(ptype, 
            {
                isSelfDrawn(): boolean {
                    return true;
                },

                get tiles(): ReadonlyArray<ReadonlyArray<SuitedOrHonorTile>> {
                    return [[ONE_BAMBOO]];
                }
            });
        })
    };
});

jest.mock('model/hand/hk/winningHand/specialWinningHand', () => {
    return {
        SpecialWinningHand: jest.fn().mockImplementation(() => {
            const ptype = Object.create(SpecialWinningHand.prototype) as SpecialWinningHand;
            return Object.assign(ptype, 
            {
                isSelfDrawn(): boolean {
                    return false;
                },

                get tiles(): ReadonlyArray<ReadonlyArray<SuitedOrHonorTile>> {
                    return [[TWO_BAMBOO]];
                }
            });
        })
    };
});

jest.mock('model/winContext/winContext', () => {
    return {
        WinContext: jest.fn().mockImplementation(() => {
            return {
                get winByRobbingAKong(): boolean {
                    return true;
                }
            }
        })
    };
});

jest.mock('model/roundContext/roundContext', () => {
    return {
        RoundContext: jest.fn().mockImplementation(() => {
            return {
                get prevailingWind(): WindDirection {
                    return WindDirection.NORTH;
                }
            }
        })
    };
});

jest.mock('model/point/configuration/root/rootPointPredicateConfiguration', () => {
    return {
        RootPointPredicateConfiguration: jest.fn().mockImplementation(() => {
            return {
                get maxPoints(): number {
                    return 13;
                }
            }
        })
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('pointPredicateUtil.ts', () => {
    const mockMeldBasedWinningHand = new MeldBasedWinningHand([], 0, ONE_BAMBOO, []);
    const mockSpecialWinningHand = new SpecialWinningHand([], 0, ONE_BAMBOO, false, false, [], SpecialWinningHandType.CUSTOM);    
    const mockWinContext = new WinContext(false, false, false, false, false, false, false, false, false, false);
    const mockRoundContext = new RoundContext(WindDirection.NORTH, WindDirection.EAST);
    const mockRootConfig = new RootPointPredicateConfiguration(13);

    const meldBasedWinningHandSpy = jest.spyOn(mockMeldBasedWinningHand, 'isSelfDrawn').mockReturnValue(true);
    const winContextSpy = jest.spyOn(mockWinContext, 'winByRobbingAKong', 'get').mockReturnValue(true);
    const roundContextSpy = jest.spyOn(mockRoundContext, 'prevailingWind', 'get').mockReturnValue(WindDirection.NORTH);
    const rootConfigSpy = jest.spyOn(mockRootConfig, 'maxPoints', 'get').mockReturnValue(13);

    describe('createPointPredicateRouter creates router', () => {
        const meldBasedPointPredicateId = 'point_predicate_util_meld_based_id';
        const meldBasedPointPredicate: PointPredicate<MeldBasedWinningHand> = 
            (mockMeldBasedWinningHand: MeldBasedWinningHand, mockWinContext: WinContext, mockRoundContext: RoundContext, mockRootConfig: RootPointPredicateConfiguration) => {
                mockMeldBasedWinningHand.isSelfDrawn();
                mockWinContext.winByRobbingAKong;
                mockRoundContext.prevailingWind;
                mockRootConfig.maxPoints;
                return new PointPredicateSingleSuccessResultBuilder().pointPredicateId(meldBasedPointPredicateId).build();
            };

        const specialPointPredicateId = 'point_predicate_util_special_id';
        const specialPointPredicate: PointPredicate<SpecialWinningHand> = 
            () => {
                return new PointPredicateFailureResultBuilder().pointPredicateId(specialPointPredicateId).build();
            };

        const testPredicate = createPointPredicateRouter(meldBasedPointPredicate, specialPointPredicate);

        test('routes correctly for meld based hand', () => {
            const result = testPredicate(mockMeldBasedWinningHand, mockWinContext, mockRoundContext, mockRootConfig);

            expect(meldBasedWinningHandSpy).toHaveBeenCalled();
            expect(winContextSpy).toHaveBeenCalled();
            expect(roundContextSpy).toHaveBeenCalled();
            expect(rootConfigSpy).toHaveBeenCalled();
            expect(result.pointPredicateId).toBe(meldBasedPointPredicateId);
            expect(result.success).toBe(true);
        });

        test('routes correctly for special hand', () => {
            const result = testPredicate(mockSpecialWinningHand, mockWinContext, mockRoundContext, mockRootConfig);

            expect(meldBasedWinningHandSpy).toHaveBeenCalledTimes(0);
            expect(winContextSpy).toHaveBeenCalledTimes(0);
            expect(roundContextSpy).toHaveBeenCalledTimes(0);
            expect(rootConfigSpy).toHaveBeenCalledTimes(0);
            expect(result.pointPredicateId).toBe(specialPointPredicateId);
            expect(result.success).toBe(false);
        });
    });

    describe('createPointPredicateRouterWithAutoFailSpecialPredicate with meld based predicate', () => {
        const meldBasedPointPredicateId = 'point_predicate_util_meld_based_id';
        const meldBasedPointPredicate: PointPredicate<MeldBasedWinningHand> = 
            (mockMeldBasedWinningHand: MeldBasedWinningHand, mockWinContext: WinContext, mockRoundContext: RoundContext, mockRootConfig: RootPointPredicateConfiguration) => {
                mockMeldBasedWinningHand.isSelfDrawn();
                mockWinContext.winByRobbingAKong;
                mockRoundContext.prevailingWind;
                mockRootConfig.maxPoints;
                return new PointPredicateSingleSuccessResultBuilder().pointPredicateId(meldBasedPointPredicateId).build();
            };

        const testPredicateId = 'point_predicate_util_argument_id';
        const testPredicate = createPointPredicateRouterWithAutoFailSpecialPredicate(testPredicateId, meldBasedPointPredicate);

        test('routes correctly for meld based hand', () => {
            const result = testPredicate(mockMeldBasedWinningHand, mockWinContext, mockRoundContext, mockRootConfig);

            expect(meldBasedWinningHandSpy).toHaveBeenCalled();
            expect(winContextSpy).toHaveBeenCalled();
            expect(roundContextSpy).toHaveBeenCalled();
            expect(rootConfigSpy).toHaveBeenCalled();
            expect(result.pointPredicateId).toBe(meldBasedPointPredicateId);
            expect(result.success).toBe(true);
        });

        test('routes correctly for special hand', () => {
            const result = testPredicate(mockSpecialWinningHand, mockWinContext, mockRoundContext, mockRootConfig);

            expect(meldBasedWinningHandSpy).toHaveBeenCalledTimes(0);
            expect(winContextSpy).toHaveBeenCalledTimes(0);
            expect(roundContextSpy).toHaveBeenCalledTimes(0);
            expect(rootConfigSpy).toHaveBeenCalledTimes(0);
            expect(result.pointPredicateId).toBe(testPredicateId);
            expect(result.success).toBe(false);
        });
    });

    describe('createPointPredicateRouterWithAutoSuccessSpecialPredicate with meld based predicate', () => {
        const meldBasedPointPredicateId = 'point_predicate_util_meld_based_id';
        const meldBasedPointPredicate: PointPredicate<MeldBasedWinningHand> = 
            (mockMeldBasedWinningHand: MeldBasedWinningHand, mockWinContext: WinContext, mockRoundContext: RoundContext, mockRootConfig: RootPointPredicateConfiguration) => {
                mockMeldBasedWinningHand.isSelfDrawn();
                mockWinContext.winByRobbingAKong;
                mockRoundContext.prevailingWind;
                mockRootConfig.maxPoints;
                return new PointPredicateFailureResultBuilder().pointPredicateId(meldBasedPointPredicateId).build();
            };

        const testPredicateId = 'point_predicate_util_argument_id';
        const testPredicate = createPointPredicateRouterWithAutoSuccessSpecialPredicate(testPredicateId, meldBasedPointPredicate);

        test('routes correctly for meld based hand', () => {
            const result = testPredicate(mockMeldBasedWinningHand, mockWinContext, mockRoundContext, mockRootConfig);

            expect(meldBasedWinningHandSpy).toHaveBeenCalled();
            expect(winContextSpy).toHaveBeenCalled();
            expect(roundContextSpy).toHaveBeenCalled();
            expect(rootConfigSpy).toHaveBeenCalled();
            expect(result.pointPredicateId).toBe(meldBasedPointPredicateId);
            expect(result.success).toBe(false);
        });

        test('routes correctly for special hand', () => {
            const result = testPredicate(mockSpecialWinningHand, mockWinContext, mockRoundContext, mockRootConfig);

            expect(meldBasedWinningHandSpy).toHaveBeenCalledTimes(0);
            expect(winContextSpy).toHaveBeenCalledTimes(0);
            expect(roundContextSpy).toHaveBeenCalledTimes(0);
            expect(rootConfigSpy).toHaveBeenCalledTimes(0);
            expect(result.pointPredicateId).toBe(testPredicateId);
            expect(result.success).toBe(true);
        });
    });

    describe('createPPResultBasedOnBooleanFlagWithTileDetail', () => {
        const pointPredicateId = 'test_id';
        const successTileDetail = new PointPredicateSuccessResultTileDetailBuilder().build();
        const failureTileDetail = new PointPredicateFailureResultTileDetailBuilder().build();

        test('flag is true returns success result', () => {
            const result = createPPResultBasedOnBooleanFlagWithTileDetail(pointPredicateId, true, successTileDetail, failureTileDetail);

            expect(result.pointPredicateId).toStrictEqual(pointPredicateId);
            expect(result.success).toBe(true);
            expect((result as PointPredicateSingleSuccessResult).tileDetail).toBe(successTileDetail);
        });

        test('flag is true without tile detail returns success result', () => {
            const result = createPPResultBasedOnBooleanFlagWithTileDetail(pointPredicateId, true);

            expect(result.pointPredicateId).toStrictEqual(pointPredicateId);
            expect(result.success).toBe(true);
        });

        test('flag is false returns failure result', () => {
            const result = createPPResultBasedOnBooleanFlagWithTileDetail(pointPredicateId, false, successTileDetail, failureTileDetail);

            expect(result.pointPredicateId).toStrictEqual(pointPredicateId);
            expect(result.success).toBe(false);
            expect((result as PointPredicateFailureResult).tileDetail).toBe(failureTileDetail);
        });

        test('flag is false without tile detail returns failure result', () => {
            const result = createPPResultBasedOnBooleanFlagWithTileDetail(pointPredicateId, false, successTileDetail, failureTileDetail);

            expect(result.pointPredicateId).toStrictEqual(pointPredicateId);
            expect(result.success).toBe(false);
        });
    });
});