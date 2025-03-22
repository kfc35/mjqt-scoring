import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration, PointPredicateBaseConfigurationBuilder } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { MAX_POINTS } from "model/point/configuration/base/pointType";

export default function createDefaultBasicWinConditionPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const map: Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();
    /* enabled by default */
    map.set(PointPredicateID.SELF_DRAW, defaultSelfDrawPointPredicateBaseConfiguration);
    map.set(PointPredicateID.ROBBING_KONG, defaultRobbingKongPredicateBaseConfiguration);
    map.set(PointPredicateID.WIN_BY_LAST_TILE, defaultWinByLastTilePredicateBaseConfiguration);
    map.set(PointPredicateID.WIN_BY_LAST_DISCARD, defaultWinByLastDiscardPredicateBaseConfiguration);
    map.set(PointPredicateID.WIN_BY_KONG, defaultWinByKongPredicateBaseConfiguration);
    map.set(PointPredicateID.WIN_BY_DOUBLE_KONG, defaultWinByDoubleKongPredicateBaseConfiguration);
    map.set(PointPredicateID.EARTHLY_HAND, defaultEarthlyHandPredicateBaseConfiguration);
    map.set(PointPredicateID.HEAVENLY_HAND, defaultHeavenlyHandPredicateBaseConfiguration);

    /* disabled by default */
    map.set(PointPredicateID.LAST_OF_ITS_KIND, defaultLastOfItsKindPredicateBaseConfiguration);
    map.set(PointPredicateID.WIN_BY_FLOWER, defaultWinByFlowerPredicateBaseConfiguration);
    map.set(PointPredicateID.WIN_BY_DOUBLE_FLOWER, defaultWinByDoubleFlowerPredicateBaseConfiguration);
    map.set(PointPredicateID.WIN_BY_MIXED_DOUBLE_REPLACEMENT, defaultWinByMixedDoubleReplacementPredicateBaseConfiguration);
    return map;
}

/** default enabled */
export const defaultSelfDrawPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultRobbingKongPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.LAST_OF_ITS_KIND]))
        .build();

export const defaultWinByLastTilePredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        // winning by last tile is technically self drawn, but in hk the self draw bonus is also added
        //.addIncludedPointPredicate(PointPredicateID.SELF_DRAW)
        .build();

export const defaultWinByLastDiscardPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultWinByKongPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(2)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SELF_DRAW]))
        .build();

export const defaultWinByDoubleKongPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(9)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SELF_DRAW, PointPredicateID.WIN_BY_KONG]))
        .build();

export const defaultEarthlyHandPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .build();

export const defaultHeavenlyHandPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .build();


/** default disabled */
export const defaultWinByFlowerPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(false)
        .points(2)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SELF_DRAW]))
        .build();

export const defaultWinByDoubleFlowerPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(false)
        .points(9)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SELF_DRAW, PointPredicateID.WIN_BY_FLOWER]))
        .build();

export const defaultWinByMixedDoubleReplacementPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(false)
        .points(9)
        .isBonus(false)
        .includedPointPredicatesGenerator(
            () => new Set([PointPredicateID.SELF_DRAW, PointPredicateID.WIN_BY_KONG, PointPredicateID.WIN_BY_FLOWER]))
        .build();

export const defaultLastOfItsKindPredicateBaseConfiguration = 
    new PointPredicateBaseConfigurationBuilder()
        .enabled(false)
        .points(2)
        .isBonus(false)
        .build();