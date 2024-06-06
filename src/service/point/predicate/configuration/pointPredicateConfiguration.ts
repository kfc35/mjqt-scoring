import { getEnumKeys } from "common/generic/enumUtils";

export interface PointPredicateConfiguration {
    options(): PointPredicateOption[]
    getOptionValue(option: PointPredicateOption): boolean | undefined;
}

export enum PointPredicateOption {
    CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR = "CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR",
    MELDED_HAND_LAST_SELF_DRAWN_TILE_MUST_COMPLETE_PAIR = "MELDED_HAND_LAST_SELF_DRAWN_TILE_MUST_COMPLETE_PAIR",
}

export const pointPredicateOptions: readonly PointPredicateOption[] = 
    getEnumKeys(PointPredicateOption).map(key => PointPredicateOption[key]);

export class BasePointPredicateConfiguration implements PointPredicateConfiguration {
    private _optionToValue: Map<PointPredicateOption, boolean | undefined>;
    
    constructor(optionToValue: Map<PointPredicateOption, boolean>) { 
        this._optionToValue = optionToValue;
    }

    options() {
        return [...this._optionToValue.keys()];
    }

    getOptionValue(option: PointPredicateOption) {
        return this._optionToValue.get(option);
    }

    override(otherConfiguration: PointPredicateConfiguration) {
        for (const option of otherConfiguration.options()) {
            this._optionToValue.set(option, otherConfiguration.getOptionValue(option));
        }
    }
}

export const defaultUndefinedPointPredicateConfiguration = new BasePointPredicateConfiguration(new Map());