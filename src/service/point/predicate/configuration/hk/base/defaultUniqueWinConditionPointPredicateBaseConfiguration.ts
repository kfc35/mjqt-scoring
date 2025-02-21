import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import PointPredicateBaseConfiguration from "service/point/predicate/configuration/base/pointPredicateBaseConfiguration";

export function createDefaultUniqueWinConditionPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF, defaultPlumBlossomOnTheRoofPointPredicateBaseConfiguration);
    map.set(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA, defaultMoonFromTheBottomOfTheSeaPointPredicateBaseConfiguration);
    return map;
}

/** default enabled */
export const defaultPlumBlossomOnTheRoofPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.WIN_BY_KONG)
        .addIncludedPointPredicate(PointPredicateID.WIN_BY_FLOWER)
        .build();

export const defaultMoonFromTheBottomOfTheSeaPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.WIN_BY_LAST_TILE)
        .build();