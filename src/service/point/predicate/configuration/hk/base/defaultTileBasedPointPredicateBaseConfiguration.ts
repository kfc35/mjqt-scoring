import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { MAX_POINTS } from "model/point/configuration/base/pointType";

export default function createDefaultTileBasedPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.ALL_HONORS_AND_TERMINALS, defaultAllHonorsAndTerminalsPointPredicateBaseConfiguration);
    map.set(PointPredicateID.ALL_ONE_SUIT_AND_HONORS, defaultAllOneSuitAndHonorsPointPredicateBaseConfiguration);
    map.set(PointPredicateID.ALL_ONE_SUIT, defaultAllOneSuitPointPredicateBaseConfiguration);
    map.set(PointPredicateID.ALL_HONORS, defaultAllHonorsPointPredicateBaseConfiguration);
    map.set(PointPredicateID.ALL_TERMINALS, defaultAllTerminalsPointPredicateBaseConfiguration);

    /* disabled by default */
    map.set(PointPredicateID.ALL_SIMPLES, defaultAllSimplesPointPredicateBaseConfiguration);
    map.set(PointPredicateID.VOIDED_SUIT, defaultVoidedSuitPointPredicateBaseConfiguration);
    return map;
}

/** enabled by default */
export const defaultAllHonorsAndTerminalsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        // this is a point in addition to pongs/kongs
        .build();

export const defaultAllOneSuitAndHonorsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .build();


export const defaultAllOneSuitPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(6)
        .isBonus(false)
        .build();

export const defaultAllHonorsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.ALL_PONGS_AND_KONGS)
        .build();


export const defaultAllTerminalsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.ALL_PONGS_AND_KONGS)
        .build();

/** disabled by default */
export const defaultAllSimplesPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(1)
        .isBonus(false)
        .build();

export const defaultVoidedSuitPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(1)
        .isBonus(false)
        .build();