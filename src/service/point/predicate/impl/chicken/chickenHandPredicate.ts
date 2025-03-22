import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateSingleSuccessResultBuilder } from "model/point/predicate/result/pointPredicateSingleSuccessResult";
import { PointPredicateFailureResultBuilder } from "model/point/predicate/result/pointPredicateFailureResult"
import type { RootPointPredicateConfiguration } from "model/point/configuration/root/rootPointPredicateConfiguration";

/** For calculating chicken hand, as an exception, we work on point predicate results.
 * This is to save on the extra computation of re-applying predicates
 */
export const calculateChickenHandResultFromResults = 
    (pointPredicateResults: PointPredicateResult[], rootConfig: RootPointPredicateConfiguration) => {
        const disqualifyingResults: PointPredicateResult[] = pointPredicateResults.filter(result => resultDisqualifiesChickenHand(result, rootConfig));
        if (disqualifyingResults.length === 0) {
            return new PointPredicateSingleSuccessResultBuilder()
            .pointPredicateId(PointPredicateID.CHICKEN_HAND)
            .build();
        }
        return new PointPredicateFailureResultBuilder()
            // we do not attach disqualifyingResults here since it would be redundant for the final payload.
            .pointPredicateId(PointPredicateID.CHICKEN_HAND)
            .build();
    }

function resultDisqualifiesChickenHand(ppr: PointPredicateResult, config: RootPointPredicateConfiguration) {
    const baseConfig = config.getBaseConfiguration(ppr.pointPredicateId);
    return ppr.success && !!baseConfig && !baseConfig.isBonus && baseConfig.enabled;
}