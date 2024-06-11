import { BasePointPredicateConfiguration, PointPredicateOption } from "service/point/predicate/configuration/pointPredicateConfiguration";

export class ConcealedHandPointPredicateConfiguration extends BasePointPredicateConfiguration {
    constructor(lastDiscardedTileMustCompletePair: boolean) {
        const optionToValue: Map<PointPredicateOption, boolean> = new Map();
        optionToValue.set(PointPredicateOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, lastDiscardedTileMustCompletePair);
        super(optionToValue);
    }
}