import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateBaseConfiguration, MAX_POINTS } from "service/point/predicate/configuration/base/pointPredicateBaseConfiguration";

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
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultRobbingKongPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.LAST_OF_ITS_KIND)
        .build();

export const defaultWinByLastTilePredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        // winning by last tile is technically self drawn, but in hk the self draw bonus is also added
        //.addIncludedPointPredicate(PointPredicateID.SELF_DRAW)
        .build();

export const defaultWinByLastDiscardPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(false)
        .build();

export const defaultWinByKongPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(2)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.SELF_DRAW)
        .build();

export const defaultWinByDoubleKongPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(9)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.SELF_DRAW)
        .addIncludedPointPredicate(PointPredicateID.WIN_BY_KONG)
        .build();

export const defaultEarthlyHandPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .build();

export const defaultHeavenlyHandPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(MAX_POINTS)
        .isBonus(false)
        .build();


/** default disabled */
export const defaultWinByFlowerPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(2)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.SELF_DRAW)
        .build();

export const defaultWinByDoubleFlowerPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(9)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.SELF_DRAW)
        .addIncludedPointPredicate(PointPredicateID.WIN_BY_FLOWER)
        .build();

export const defaultWinByMixedDoubleReplacementPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(9)
        .isBonus(false)
        .addIncludedPointPredicate(PointPredicateID.SELF_DRAW)
        .addIncludedPointPredicate(PointPredicateID.WIN_BY_KONG)
        .addIncludedPointPredicate(PointPredicateID.WIN_BY_FLOWER)
        .build();

export const defaultLastOfItsKindPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(false)
        .points(2)
        .isBonus(false)
        .build();