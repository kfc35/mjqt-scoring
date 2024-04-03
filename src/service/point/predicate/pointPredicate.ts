import { WinningHand } from "model/hand/hk/winningHand/winningHand"
import { WinContext } from "model/winContext/winContext"
import PointPredicateResult from "service/point/predicate/pointPredicateResult"

export type PointPredicate<T extends WinningHand> = 
    ((winningHand : T, winContext? : WinContext[]) => PointPredicateResult)