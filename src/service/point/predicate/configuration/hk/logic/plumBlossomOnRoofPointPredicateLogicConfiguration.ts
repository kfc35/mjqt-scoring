import { PointPredicateLogicConfiguration } from "service/point/predicate/configuration/logic/pointPredicateLogicConfiguration";
import { PointPredicateLogicOption } from "../../logic/pointPredicateLogicOption";

export default class PlumBlossomOnRoofPointPredicateLogicConfiguration extends PointPredicateLogicConfiguration {
    constructor(anyReplacementAllowed: boolean) {
        const optionToValue: Map<PointPredicateLogicOption, boolean> = new Map();
        optionToValue.set(PointPredicateLogicOption.PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED, anyReplacementAllowed);
        super(optionToValue);
    }

    get anyReplacementAllowed() : boolean | undefined {
        return super.getOptionValue(PointPredicateLogicOption.PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED);
    }
}