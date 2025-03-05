import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { MAX_POINTS } from "model/point/configuration/base/pointType";

export default function createDefaultJewelDragonHandPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.JADE_DRAGON, defaultJadeDragonPointPredicateBaseConfiguration);
    map.set(PointPredicateID.RUBY_DRAGON, defaultRubyDragonPointPredicateBaseConfiguration);
    map.set(PointPredicateID.PEARL_DRAGON, defaultPearlDragonPointPredicateBaseConfiguration);
    
    return map;
}
export const defaultJadeDragonPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.ALL_PONGS_AND_KONGS]))
        .build();

export const defaultRubyDragonPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.ALL_PONGS_AND_KONGS]))
        .build();

export const defaultPearlDragonPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.ALL_PONGS_AND_KONGS]))
        .build();