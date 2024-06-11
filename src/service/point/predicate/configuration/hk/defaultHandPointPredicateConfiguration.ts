import { defaultConcealedHandPointPredicateConfiguration } from "service/point/predicate/configuration/hk/defaultConcealedHandPointPredicateConfiguration";
import { defaultMeldedHandPointPredicateConfiguration } from "service/point/predicate/configuration/hk/defaultMeldedHandPointPredicateConfiguration";
import { BasePointPredicateConfiguration } from "service/point/predicate/configuration/pointPredicateConfiguration";

export const defaultPointPredicateConfiguration = new BasePointPredicateConfiguration(new Map())
    .override(defaultConcealedHandPointPredicateConfiguration)
    .override(defaultMeldedHandPointPredicateConfiguration);