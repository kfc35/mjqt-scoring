import { BasePointPredicateConfiguration, PointPredicateOption } from "service/point/predicate/configuration/pointPredicateConfiguration";

export class SelfTripletsPointPredicateConfiguration extends BasePointPredicateConfiguration {
    constructor(onlyPongsAllowed: boolean) {
        const optionToValue: Map<PointPredicateOption, boolean> = new Map();
        optionToValue.set(PointPredicateOption.SELF_TRIPLETS_ONLY_PONGS_ALLOWED, onlyPongsAllowed);
        super(optionToValue);
    }
}