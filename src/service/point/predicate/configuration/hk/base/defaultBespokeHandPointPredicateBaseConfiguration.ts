import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration, PointPredicateBaseConfigurationBuilder } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { MAX_POINTS } from "model/point/configuration/base/pointType";

export default function createDefaultBespokeHandPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.NINE_GATES, defaultNineGatesPointPredicateBaseConfiguration);
    map.set(PointPredicateID.THIRTEEN_ORPHANS, defaultThirteenOrphansPointPredicateBaseConfiguration);
    
    return map;
}
export const defaultNineGatesPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.CONCEALED_HAND, PointPredicateID.ALL_ONE_SUIT]))
        .build();

export const defaultThirteenOrphansPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.CONCEALED_HAND, PointPredicateID.ALL_HONORS_AND_TERMINALS]))
        .build();