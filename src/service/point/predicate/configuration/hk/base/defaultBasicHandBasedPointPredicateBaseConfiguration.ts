import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { MAX_POINTS } from "model/point/configuration/base/pointType";

export default function createDefaultBasicHandBasedPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.ALL_CHOWS, defaultAllChowsPointPredicateBaseConfiguration);
    map.set(PointPredicateID.COMMON_HAND, defaultCommonHandPointPredicateBaseConfiguration);
    map.set(PointPredicateID.ALL_PONGS_AND_KONGS, defaultAllPongsKongsPointPredicateBaseConfiguration);
    map.set(PointPredicateID.SEVEN_PAIRS, defaultSevenPairsPointPredicateBaseConfiguration);
    map.set(PointPredicateID.ALL_KONGS, defaultAllKongsPointPredicateBaseConfiguration);
    
    return map;
}

/** default enabled */
export const defaultAllChowsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultCommonHandPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.ALL_CHOWS)
        .addIncludedPointPredicate(PointPredicateID.NO_GENTLEMEN_OR_SEASONS)
        .addIncludedPointPredicate(PointPredicateID.SELF_DRAW)
        .build();

export const defaultAllPongsKongsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .build();

export const defaultSevenPairsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(4)
        .isBonus(false)
        .build();

export const defaultAllKongsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .build();