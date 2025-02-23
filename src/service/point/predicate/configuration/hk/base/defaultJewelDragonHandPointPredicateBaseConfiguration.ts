import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import PointPredicateBaseConfiguration, { MAX_POINTS } from "service/point/predicate/configuration/base/pointPredicateBaseConfiguration";

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
        .build();

export const defaultRubyDragonPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .build();

export const defaultPearlDragonPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .build();