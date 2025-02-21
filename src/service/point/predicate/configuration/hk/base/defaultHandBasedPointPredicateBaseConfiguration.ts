import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import PointPredicateBaseConfiguration from "service/point/predicate/configuration/base/pointPredicateBaseConfiguration";

export function createDefaultWinConditionPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.SEVEN_PAIRS, defaultSevenPairsPointPredicateBaseConfiguration);
    map.set(PointPredicateID.ALL_CHOWS, defaultAllChowsPointPredicateBaseConfiguration);
    return map;
}

/** default enabled */
export const defaultSevenPairsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(4)
        .isBonus(false)
        .build();

export const defaultAllChowsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .build();