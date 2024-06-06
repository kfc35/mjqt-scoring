import { BasePointPredicateConfiguration, PointPredicateOption } from "service/point/predicate/configuration/pointPredicateConfiguration";

export class MeldedHandPointPredicateConfiguration extends BasePointPredicateConfiguration {
    constructor(lastSelfDrawnTileMustCompletePair: boolean) {
        const optionToValue: Map<PointPredicateOption, boolean> = new Map();
        optionToValue.set(PointPredicateOption.MELDED_HAND_LAST_SELF_DRAWN_TILE_MUST_COMPLETE_PAIR, lastSelfDrawnTileMustCompletePair);
        super(optionToValue);
    }
}

export const defaultMeldedHandPointPredicateConfiguration = new MeldedHandPointPredicateConfiguration(true);