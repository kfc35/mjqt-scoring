import { PointPredicateLogicConfiguration } from "model/point/configuration/logic/pointPredicateLogicConfiguration";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";

export class SelfTripletsPointPredicateLogicConfiguration extends PointPredicateLogicConfiguration {
    constructor(onlyPongsAllowed: boolean) {
        const optionToValue: Map<PointPredicateLogicOption, boolean> = new Map();
        optionToValue.set(PointPredicateLogicOption.SELF_TRIPLETS_ONLY_PONGS_ALLOWED, onlyPongsAllowed);
        super(optionToValue);
    }

    get onlyPongsAllowed() : boolean | undefined {
        return super.getOptionValue(PointPredicateLogicOption.SELF_TRIPLETS_ONLY_PONGS_ALLOWED);
    }
}