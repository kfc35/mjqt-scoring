import { BasePointPredicateConfiguration, PointPredicateOption } from "service/point/predicate/configuration/pointPredicateConfiguration";

export class MeldedHandPointPredicateConfiguration extends BasePointPredicateConfiguration {
    constructor(lastDiscardedTileMustCompletePair: boolean, allowSelfDrawToCompletePair: boolean) {
        const optionToValue: Map<PointPredicateOption, boolean> = new Map();
        optionToValue.set(PointPredicateOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, lastDiscardedTileMustCompletePair);
        optionToValue.set(PointPredicateOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR, allowSelfDrawToCompletePair);
        super(optionToValue);
    }
}