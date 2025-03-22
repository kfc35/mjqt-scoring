import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration, PointPredicateBaseConfigurationBuilder } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";

export default function createDefaultUniqueWinConditionPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF, defaultPlumBlossomOnTheRoofPointPredicateBaseConfiguration);
    map.set(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA, defaultMoonFromTheBottomOfTheSeaPointPredicateBaseConfiguration);
    return map;
}

/** default enabled */
export const defaultPlumBlossomOnTheRoofPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            (logicConfig) => (logicConfig.getOptionValue(PointPredicateLogicOption.PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED) ? 
                new Set([PointPredicateID.WIN_BY_KONG, PointPredicateID.WIN_BY_FLOWER]) : new Set([PointPredicateID.WIN_BY_KONG])))
        .build();

export const defaultMoonFromTheBottomOfTheSeaPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.WIN_BY_LAST_TILE]))
        .build();