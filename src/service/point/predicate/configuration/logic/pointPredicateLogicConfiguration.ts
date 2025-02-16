import { getEnumKeys } from "common/generic/enumUtils";

export enum PointPredicateLogicOption {
    /** A regular concealed hand can be won by discard. 
     * This option restricts concealed hands such that the discard can only complete the pair, rather than any of the melds
     * i.e. for a concealed hand, all the non-pair melds must be self drawn if you win via discard. 
     * Default = false for HK, true for international
     * (a "fully" concealed hand is completely self drawn)
     * */
    CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR = "CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR",
    // side note: a concealed hand's winning self drawn tile can be used to complete any meld.

    /** A regular melded hand is won when all four non-pair melds are exposed.
     * This option restricts melded hands such that the last winning discarded tile must complete your pair rather than any of the other melds.
     * i.e. all four non-pair melds must be fully exposed before winning via your pair.
     * Default = true
     * (a "fully" melded hand has all four non-pair melds exposed and is won by discard for your pair)
     */
    MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR = "MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR",
    /** This option allows melded hands to have a self drawn pair alongside the four exposed non-pair melds.
     * Default = false. */
    MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR = "MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR",

    // Only pongs are allowed for self triplets (no kongs). Default = true
    SELF_TRIPLETS_ONLY_PONGS_ALLOWED = "SELF_TRIPLETS_ONLY_PONGS_ALLOWED", 

    // A replacement from flower also counts for getting the five circle. Default = false (only Kongs allowed)
    PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED = "PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED"
}

export const pointPredicateLogicOptions: readonly PointPredicateLogicOption[] = 
    getEnumKeys(PointPredicateLogicOption).map(key => PointPredicateLogicOption[key]);

export class PointPredicateLogicConfiguration {
    private _optionToValue: Map<PointPredicateLogicOption, boolean | undefined>;
    
    constructor(optionToValue?: Map<PointPredicateLogicOption, boolean | undefined>) { 
        this._optionToValue = optionToValue ?? new Map<PointPredicateLogicOption, boolean | undefined>();
    }

    options(): PointPredicateLogicOption[] {
        return [...this._optionToValue.entries()]
            .filter(([, value]) => value !== undefined)
            .map(([opt, ]) => opt);
    }

    getOptionValue(option: PointPredicateLogicOption): boolean | undefined {
        return this._optionToValue.get(option);
    }

    override(otherConfiguration: PointPredicateLogicConfiguration): this {
        for (const option of otherConfiguration.options()) {
            this._optionToValue.set(option, otherConfiguration.getOptionValue(option));
        }
        return this;
    }

    clone(): PointPredicateLogicConfiguration {
        return new PointPredicateLogicConfiguration(this._optionToValue);
    }
}