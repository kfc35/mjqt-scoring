import { ConcealedHandPointPredicateLogicConfiguration } from "service/point/predicate/configuration/hk/logic/concealedHandPointPredicateLogicConfiguration";
import { MeldedHandPointPredicateLogicConfiguration } from "service/point/predicate/configuration/hk/logic/meldedHandPointPredicateLogicConfiguration";
import { SelfTripletsPointPredicateLogicConfiguration } from "service/point/predicate/configuration/hk/logic/selfTripletsPointPredicateLogicConfiguration";
import { PlumBlossomOnRoofPointPredicateLogicConfiguration } from "service/point/predicate/configuration/hk/logic/plumBlossomOnRoofPointPredicateLogicConfiguration";
import { CommonHandPointPredicateLogicConfiguration } from "service/point/predicate/configuration/hk/logic/commonHandPointPredicateLogicConfiguration";
import { PointPredicateLogicConfiguration } from "service/point/predicate/configuration/logic/pointPredicateLogicConfiguration";

/** refer to PointPredicateLogicOption for details on defaults. */
export const defaultConcealedHandPointPredicateLogicConfiguration = new ConcealedHandPointPredicateLogicConfiguration(false);
export const defaultMeldedHandPointPredicateLogicConfiguration = new MeldedHandPointPredicateLogicConfiguration(true, false);
export const defaultSelfTripletsPointPredicateLogicConfiguration = new SelfTripletsPointPredicateLogicConfiguration(true);
export const defaultPlumBlossomOnRoofPointPredicateLogicConfiguration = new PlumBlossomOnRoofPointPredicateLogicConfiguration(false);
export const defaultCommonHandPointPredicateLogicConfiguration = new CommonHandPointPredicateLogicConfiguration(false);

export const defaultPointPredicateLogicConfiguration = new PointPredicateLogicConfiguration(new Map())
    .override(defaultConcealedHandPointPredicateLogicConfiguration)
    .override(defaultMeldedHandPointPredicateLogicConfiguration)
    .override(defaultSelfTripletsPointPredicateLogicConfiguration)
    .override(defaultPlumBlossomOnRoofPointPredicateLogicConfiguration)
    .override(defaultCommonHandPointPredicateLogicConfiguration);