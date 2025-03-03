import { getEnumKeys } from "common/generic/enumUtils";
import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";

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