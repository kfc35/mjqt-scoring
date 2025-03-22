import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration, PointPredicateBaseConfigurationBuilder } from "model/point/configuration/base/pointPredicateBaseConfiguration";
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
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        // this is a point in addition to pongs/kongs
        .build();

export const defaultAllOneSuitAndHonorsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(3)
        .isBonus(false)
        .build();


export const defaultAllOneSuitPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(6)
        .isBonus(false)
        .build();

export const defaultAllHonorsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.ALL_PONGS_AND_KONGS]))
        .build();


export const defaultAllTerminalsPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false).includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.ALL_PONGS_AND_KONGS]))
        .build();

/** disabled by default */
export const defaultAllSimplesPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(false)
        .points(1)
        .isBonus(false)
        .build();

export const defaultVoidedSuitPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(false)
        .points(1)
        .isBonus(false)
        .build();