import { defaultPointPredicateBaseConfigurationMap } from "service/point/predicate/configuration/hk/defaultPointPredicateBaseConfiguration";
import { defaultPointPredicateLogicConfiguration } from "service/point/predicate/configuration/hk/defaultPointPredicateLogicConfiguration";
import { RootPointPredicateConfiguration } from "service/point/predicate/configuration/root/rootPointPredicateConfiguration";

export const DEFAULT_MAX_POINTS: number = 13;
export const defaultRootPointPredicateConfiguration = createDefaultRootPointPredicateConfiguration();

function createDefaultRootPointPredicateConfiguration(): RootPointPredicateConfiguration {
    const defaultRootPointPredicateConfiguration = new RootPointPredicateConfiguration(DEFAULT_MAX_POINTS);
    defaultRootPointPredicateConfiguration.importBaseConfigurationMap(defaultPointPredicateBaseConfigurationMap);
    defaultRootPointPredicateConfiguration.importLogicConfiguration(defaultPointPredicateLogicConfiguration);
    return defaultRootPointPredicateConfiguration;
}