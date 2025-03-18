import { WinContext } from "model/winContext/winContext";
import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";
import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { SpecialWinningHand } from "model/hand/hk/winningHand/specialWinningHand";
import { SpecialWinningHandType } from "model/hand/hk/winningHand/specialWinningHandType";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { ONE_BAMBOO } from "common/deck";
import { notSelfDrawSubPredicate } from "service/point/predicate/impl/winCondition/basicWinConditionSubPredicate";

jest.mock('model/hand/hk/winningHand/meldBasedWinningHand', () => {
    return {
        MeldBasedWinningHand: jest.fn().mockImplementation(() => {
            return {
                isSelfDrawn(): boolean {
                    return false;
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
    const basicRoundContext = new RoundContext(WindDirection.WEST, WindDirection.EAST);
    const rootConfig = new RootPointPredicateConfiguration(13);

    describe('notSelfDrawSubPredicate', () => {
        test('hand is self drawn returns false', () => {
            jest.spyOn(mockMeldBasedWinningHand, 'isSelfDrawn').mockReturnValue(true);
            jest.spyOn(mockSpecialWinningHand, 'isSelfDrawn').mockReturnValue(true);

            const meldHandResult = notSelfDrawSubPredicate(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);
            const specialHandResult = notSelfDrawSubPredicate(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW);
            expect(meldHandResult.success).toBe(false);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW);
            expect(specialHandResult.success).toBe(false);
        });

        test('hand is not self drawn returns true', () => {
            jest.spyOn(mockMeldBasedWinningHand, 'isSelfDrawn').mockReturnValue(false);
            jest.spyOn(mockSpecialWinningHand, 'isSelfDrawn').mockReturnValue(false);

            const meldHandResult = notSelfDrawSubPredicate(mockMeldBasedWinningHand, basicWinContext, basicRoundContext, rootConfig);
            const specialHandResult = notSelfDrawSubPredicate(mockSpecialWinningHand, basicWinContext, basicRoundContext, rootConfig);
                        
            expect(meldHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW);
            expect(meldHandResult.success).toBe(true);
            expect(specialHandResult.pointPredicateId).toBe(PointPredicateID.SUBPREDICATE_NOT_SELF_DRAW);
            expect(specialHandResult.success).toBe(true);
        });
    });
});