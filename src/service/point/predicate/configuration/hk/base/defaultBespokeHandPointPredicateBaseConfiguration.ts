import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import PointPredicateBaseConfiguration, { MAX_POINTS } from "service/point/predicate/configuration/base/pointPredicateBaseConfiguration";

export default function createDefaultBespokeHandPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.NINE_GATES, defaultNineGatesPointPredicateBaseConfiguration);
    map.set(PointPredicateID.THIRTEEN_ORPHANS, defaultThirteenOrphansPointPredicateBaseConfiguration);
    
    return map;
}
export const defaultNineGatesPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.CONCEALED_HAND)
        .addIncludedPointPredicate(PointPredicateID.ALL_ONE_SUIT)
        .build();

export const defaultThirteenOrphansPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.CONCEALED_HAND)
        .build();