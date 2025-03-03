import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import createDefaultBasicHandBasedPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultBasicHandBasedPointPredicateBaseConfiguration";
import createDefaultBasicWinConditionPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultBasicWinConditionPointPredicateBaseConfiguration";
import createDefaultBespokeHandPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultBespokeHandPointPredicateBaseConfiguration";
import createDefaultConcealedOrMeldedHandBasedPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultConcealedOrMeldedHandPointPredicateBaseConfiguration";
import createDefaultFlowerPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultFlowerPointPredicateBaseConfiguration";
import createDefaultJewelDragonHandPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultJewelDragonHandPointPredicateBaseConfiguration";
import createDefaultMeldBasedPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultMeldBasedPointPredicateBaseConfiguration";
import createDefaultTileBasedPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultTileBasedPointPredicateBaseConfiguration";
import createDefaultUniqueWinConditionPointPredicateBaseConfigurationMap from "service/point/predicate/configuration/hk/base/defaultUniqueWinConditionPointPredicateBaseConfiguration";

export const defaultPointPredicateBaseConfigurationMap : Map<PointPredicateID, PointPredicateBaseConfiguration> = createDefaultPointPredicateBaseConfigurationMap();

function createDefaultPointPredicateBaseConfigurationMap(): Map<PointPredicateID, PointPredicateBaseConfiguration> {
    const defaultPointPredicateBaseConfigurationMap : Map<PointPredicateID, PointPredicateBaseConfiguration> = new Map();

    const defaultBasicHandBasedPointPredicateBaseConfiguration = createDefaultBasicHandBasedPointPredicateBaseConfigurationMap();
    defaultBasicHandBasedPointPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    const defaultBasicWinConditionPointPredicateBaseConfiguration = createDefaultBasicWinConditionPointPredicateBaseConfigurationMap();
    defaultBasicWinConditionPointPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    const defaultBespokeHandPointPredicateBaseConfiguration = createDefaultBespokeHandPointPredicateBaseConfigurationMap();
    defaultBespokeHandPointPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    const defaultConcealedOrMeldedHandPointPredicateBaseConfiguration = createDefaultConcealedOrMeldedHandBasedPointPredicateBaseConfigurationMap();
    defaultConcealedOrMeldedHandPointPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    const defaultFlowerPointPredicateBaseConfiguration = createDefaultFlowerPointPredicateBaseConfigurationMap();
    defaultFlowerPointPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    const defaultJewelDragonHandPredicateBaseConfiguration = createDefaultJewelDragonHandPointPredicateBaseConfigurationMap();
    defaultJewelDragonHandPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    const defaultMeldBasedPredicateBaseConfiguration = createDefaultMeldBasedPointPredicateBaseConfigurationMap();
    defaultMeldBasedPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    const defaultTileBasedPredicateBaseConfiguration = createDefaultTileBasedPointPredicateBaseConfigurationMap();
    defaultTileBasedPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    const defaulUniqueWinConditionPredicateBaseConfiguration = createDefaultUniqueWinConditionPointPredicateBaseConfigurationMap();
    defaulUniqueWinConditionPredicateBaseConfiguration.forEach((val, key) => defaultPointPredicateBaseConfigurationMap.set(key, val));

    return defaultPointPredicateBaseConfigurationMap;
}