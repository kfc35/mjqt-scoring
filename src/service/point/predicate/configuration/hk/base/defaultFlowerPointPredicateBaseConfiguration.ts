import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { MAX_POINTS } from "model/point/configuration/base/pointType";

export default function createDefaultFlowerPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.NO_GENTLEMEN_OR_SEASONS, defaultNoGentlemenOrSeasonsBaseConfiguration);
    map.set(PointPredicateID.SEAT_GENTLEMAN, defaultSeatGentlemanBaseConfiguration);
    map.set(PointPredicateID.SEAT_SEASON, defaultSeatSeasonBaseConfiguration);
    map.set(PointPredicateID.ALL_GENTLEMEN, defaultAllGentlemenBaseConfiguration);
    map.set(PointPredicateID.ALL_SEASONS, defaultAllSeasonsBaseConfiguration);

    /* disabled by default */
    map.set(PointPredicateID.PREVAILING_GENTLEMAN, defaultPrevailingGentlemanBaseConfiguration);
    map.set(PointPredicateID.PREVAILING_SEASON, defaultPrevailingSeasonBaseConfiguration);
    map.set(PointPredicateID.ALL_GENTLEMAN_AND_SEASONS, defaultAllGentlemenAndSeasonsBaseConfiguration);
    return map;
}

/* enabled by default */
export const defaultNoGentlemenOrSeasonsBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultSeatGentlemanBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultSeatSeasonBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultAllGentlemenBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(2)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SEAT_GENTLEMAN, PointPredicateID.PREVAILING_GENTLEMAN]))
        .build();

export const defaultAllSeasonsBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(2)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SEAT_SEASON, PointPredicateID.PREVAILING_SEASON]))
        .build();

/* disabled by default */
export const defaultPrevailingGentlemanBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(1)
        .isBonus(false)
        .build();
    
export const defaultPrevailingSeasonBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(1)
        .isBonus(false)
        .build();

export const defaultAllGentlemenAndSeasonsBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SEAT_GENTLEMAN, PointPredicateID.SEAT_SEASON, 
                PointPredicateID.PREVAILING_GENTLEMAN, PointPredicateID.PREVAILING_SEASON,
                PointPredicateID.ALL_GENTLEMEN, PointPredicateID.ALL_SEASONS]))
        .build();