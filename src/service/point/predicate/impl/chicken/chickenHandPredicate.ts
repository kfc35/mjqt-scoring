import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import PointPredicateResult from "service/point/predicate/result/pointPredicateResult";
import PointPredicateSingleSuccessResult from "service/point/predicate/result/pointPredicateSingleSuccessResult";
import PointPredicateFailureResult from "service/point/predicate/result/pointPredicateFailureResult"
import type { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";

/** For calculating chicken hand, as an exception, we work on point predicate results.
 * This is to save on the extra computation of re-applying predicates
 */
export const calculateChickenHandResultFromResults = 
    (pointPredicateResults: PointPredicateResult[], rootConfig: RootPointPredicateConfiguration) => {
        const disqualifyingResults: PointPredicateResult[] = pointPredicateResults.filter(result => resultDisqualifiesChickenHand(result, rootConfig));
        if (disqualifyingResults.length === 0) {
            return new PointPredicateSingleSuccessResult.Builder()
            .pointPredicateId(PointPredicateID.CHICKEN_HAND)
            .build();
        }
        return new PointPredicateFailureResult.Builder()
            // we do not attach disqualifyingResults here since it would be redundant for the final payload.
            .pointPredicateId(PointPredicateID.CHICKEN_HAND)
            .build();
    }

function resultDisqualifiesChickenHand(ppr: PointPredicateResult, config: RootPointPredicateConfiguration) {
    const baseConfig = config.getBaseConfiguration(ppr.pointPredicateId);
    return ppr.success && !!baseConfig && !baseConfig.isBonus && baseConfig.enabled;
}