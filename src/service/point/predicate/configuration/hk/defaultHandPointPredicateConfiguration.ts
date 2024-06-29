import { defaultConcealedHandPointPredicateConfiguration } from "service/point/predicate/configuration/hk/defaultConcealedHandPointPredicateConfiguration";
import { defaultMeldedHandPointPredicateConfiguration } from "service/point/predicate/configuration/hk/defaultMeldedHandPointPredicateConfiguration";
import { defaultSelfTripletsPointPredicateConfiguration } from "service/point/predicate/configuration/hk/defaultSelfTripletsPointPredicateConfiguration";
import { BasePointPredicateConfiguration } from "service/point/predicate/configuration/pointPredicateConfiguration";

export const defaultPointPredicateConfiguration = new BasePointPredicateConfiguration(new Map())
    .override(defaultConcealedHandPointPredicateConfiguration)
    .override(defaultMeldedHandPointPredicateConfiguration)
    .override(defaultSelfTripletsPointPredicateConfiguration);