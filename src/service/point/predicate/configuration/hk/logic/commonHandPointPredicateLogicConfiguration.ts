import { PointPredicateLogicConfiguration } from "service/point/predicate/configuration/logic/pointPredicateLogicConfiguration";
import { PointPredicateLogicOption } from "../../logic/pointPredicateLogicOption";

export default class CommonHandPointPredicateLogicConfiguration extends PointPredicateLogicConfiguration {
    constructor(mustHaveValuelessPair: boolean) {
        const optionToValue: Map<PointPredicateLogicOption, boolean> = new Map();
        optionToValue.set(PointPredicateLogicOption.COMMON_HAND_MUST_HAVE_VALUELESS_PAIR, mustHaveValuelessPair);
        super(optionToValue);
    }

    get mustHaveValuelessPair() : boolean | undefined {
        return super.getOptionValue(PointPredicateLogicOption.COMMON_HAND_MUST_HAVE_VALUELESS_PAIR);
    }
}