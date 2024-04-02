import { RoundContext } from "model/roundContext/roundContext"
import { WinningHand } from "model/hand/hk/winningHand"
import { WinContext } from "model/hand/hk/winContext"
import PointPredicateResult from "service/pointCalculator/predicate/pointPredicateResult"

export type PointPredicate<T extends WinningHand> = (winningHand : T, roundContext : RoundContext, winContext: WinContext[]) => PointPredicateResult