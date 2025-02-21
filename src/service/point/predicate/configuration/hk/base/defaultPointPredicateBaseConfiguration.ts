import PointPredicateBaseConfiguration from "service/point/predicate/configuration/base/pointPredicateBaseConfiguration";

export const defaultNoFlowersBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(true)
        .build();

export const defaultSeatFlowerBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(1)
        .isBonus(true)
        .build();

export const defaultConcealedHandPointPredicateBaseConfiguration = 
    new PointPredicateBaseConfiguration.Builder()
        .enabled(true)
        .points(4)
        .build();
