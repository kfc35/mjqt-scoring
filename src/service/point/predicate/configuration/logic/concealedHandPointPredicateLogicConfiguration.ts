import { PointPredicateLogicConfiguration, PointPredicateLogicOption } from "service/point/predicate/configuration/logic/pointPredicateLogicConfiguration";

export default class ConcealedHandPointPredicateLogicConfiguration extends PointPredicateLogicConfiguration {
    constructor(lastDiscardedTileMustCompletePair: boolean) {
        const optionToValue: Map<PointPredicateLogicOption, boolean> = new Map();
        optionToValue.set(PointPredicateLogicOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, lastDiscardedTileMustCompletePair);
        super(optionToValue);
    }

    get lastDiscardedTileMustCompletePair() : boolean | undefined {
        return super.getOptionValue(PointPredicateLogicOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR);
    }
}