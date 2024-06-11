import { getEnumKeys } from "common/generic/enumUtils";

export interface PointPredicateConfiguration {
    options(): PointPredicateOption[]
    getOptionValue(option: PointPredicateOption): boolean | undefined;
}

export enum PointPredicateOption {
    /** A regular concealed hand can be won by discard. 
     * This option restricts concealed hands such that the discard can only complete the pair, rather than any of the melds
     * i.e. all the non-pair melds must be fully self drawn if you are winning via discard. 
     * Default = false for HK, true for international
     * (a "fully" concealed hand is completely self drawn)
     * */
    CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR = "CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR",
    // a concealed hand's winning self drawn tile can be used to complete any meld.

    /** A regular melded hand is won when all four non-pair melds are exposed.
     * This option restricts melded hands such that the last winning discarded tile must complete your pair rather than any of the other melds.
     * i.e. all four non-pair melds must be fully exposed before winning via your pair.
     * Default = true
     * (a "fully" melded hand has all four non-pair melds exposed and is won by discard)
     */
    MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR = "MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR",
    /** This option allows melded hands to have a self drawn pair alongside the four exposed non-pair melds.
     * Default = false. */
    MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR = "MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR",
}

export const pointPredicateOptions: readonly PointPredicateOption[] = 
    getEnumKeys(PointPredicateOption).map(key => PointPredicateOption[key]);

export class BasePointPredicateConfiguration implements PointPredicateConfiguration {
    private _optionToValue: Map<PointPredicateOption, boolean | undefined>;
    
    constructor(optionToValue: Map<PointPredicateOption, boolean | undefined>) { 
        this._optionToValue = optionToValue;
    }

    options() {
        return [...this._optionToValue.entries()]
            .filter(([, value]) => value !== undefined)
            .map(([opt, ]) => opt);
    }

    getOptionValue(option: PointPredicateOption) {
        return this._optionToValue.get(option);
    }

    override(otherConfiguration: PointPredicateConfiguration): this {
        for (const option of otherConfiguration.options()) {
            this._optionToValue.set(option, otherConfiguration.getOptionValue(option));
        }
        return this;
    }

    clone(): BasePointPredicateConfiguration {
        return new BasePointPredicateConfiguration(this._optionToValue);
    }
}