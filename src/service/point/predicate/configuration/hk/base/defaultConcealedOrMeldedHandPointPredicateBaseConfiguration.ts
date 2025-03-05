import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { MAX_POINTS } from "model/point/configuration/base/pointType";

export default function createDefaultConcealedOrMeldedHandBasedPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.CONCEALED_HAND, defaultConcealedHandPointPredicateBaseConfiguration);
    map.set(PointPredicateID.SELF_TRIPLETS, defaultSelfTripletsPointPredicateBaseConfiguration);
   
    /* disabled by default */
    map.set(PointPredicateID.FULLY_CONCEALED_HAND, defaultFullyConcealedHandPointPredicateBaseConfiguration);
    map.set(PointPredicateID.MELDED_HAND, defaultMeldedHandPointPredicateBaseConfiguration);
    map.set(PointPredicateID.FULLY_MELDED_HAND, defaultFullyMeldedHandPointPredicateBaseConfiguration);

    return map;
}

/** default enabled */
export const defaultConcealedHandPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultSelfTripletsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.ALL_PONGS_AND_KONGS, PointPredicateID.CONCEALED_HAND]))
        .build();

/** default disabled */
export const defaultFullyConcealedHandPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(3)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SELF_DRAW, PointPredicateID.CONCEALED_HAND]))
        .build();

export const defaultMeldedHandPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(3)
        .isBonus(false)
        .build();

export const defaultFullyMeldedHandPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(6)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.MELDED_HAND]))
        .build();