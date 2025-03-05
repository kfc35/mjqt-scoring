import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { MAX_POINTS } from "model/point/configuration/base/pointType";

export default function createDefaultMeldBasedPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();

    map.set(PointPredicateID.GREEN_DRAGON_PONG_KONG, defaultGreenDragonPongKongBaseConfiguration);
    map.set(PointPredicateID.RED_DRAGON_PONG_KONG, defaultRedDragonPongKongBaseConfiguration);
    map.set(PointPredicateID.WHITE_DRAGON_PONG_KONG, defaultWhiteDragonPongKongBaseConfiguration);
    map.set(PointPredicateID.SEAT_WIND_PONG_KONG, defaultSeatWindPongKongBaseConfiguration);
    map.set(PointPredicateID.PREVAILING_WIND_PONG_KONG, defaultPrevailingWindPongKongBaseConfiguration);

    map.set(PointPredicateID.SMALL_THREE_DRAGONS, defaultSmallThreeDragonsBaseConfiguration);
    map.set(PointPredicateID.BIG_THREE_DRAGONS, defaultSmallThreeDragonsBaseConfiguration);
    map.set(PointPredicateID.SMALL_FOUR_WINDS, defaultSmallFourWindsBaseConfiguration);
    map.set(PointPredicateID.BIG_FOUR_WINDS, defaultBigFourWindsBaseConfiguration);
    return map;
}

/* enabled by default */
export const defaultGreenDragonPongKongBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultRedDragonPongKongBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultWhiteDragonPongKongBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultSeatWindPongKongBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultPrevailingWindPongKongBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultSmallThreeDragonsBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(5)
        .isBonus(false)
        .build();

export const defaultBigThreeDragonsBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(8)
        .isBonus(false)
        .build();


export const defaultSmallFourWindsBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(6)
        .isBonus(false)
        .build();

export const defaultBigFourWindsBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.ALL_PONGS_AND_KONGS]))
        .build();