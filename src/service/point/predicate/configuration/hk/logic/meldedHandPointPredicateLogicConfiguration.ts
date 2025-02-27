import { PointPredicateLogicConfiguration } from "service/point/predicate/configuration/logic/pointPredicateLogicConfiguration";
import { PointPredicateLogicOption } from "../../logic/pointPredicateLogicOption";

export class MeldedHandPointPredicateLogicConfiguration extends PointPredicateLogicConfiguration {
    constructor(lastDiscardedTileMustCompletePair: boolean, allowSelfDrawToCompletePair: boolean) {
        const optionToValue: Map<PointPredicateLogicOption, boolean> = new Map();
        optionToValue.set(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR, lastDiscardedTileMustCompletePair);
        optionToValue.set(PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR, allowSelfDrawToCompletePair);
        super(optionToValue);
    }

    get lastDiscardedTileMustCompletePair() : boolean | undefined {
        return super.getOptionValue(PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR);
    }

    get allowSelfDrawToCompletePair() : boolean | undefined {
        return super.getOptionValue(PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR);
    }
}