import { PointPredicateLogicOption } from "model/point/configuration/logic/pointPredicateLogicOption";

export class PointPredicateLogicConfiguration {
    private _optionToValue: Map<string, boolean | undefined>;
    
    constructor(optionToValue?: Map<string, boolean | undefined>) { 
        this._optionToValue = optionToValue ?? new Map<string, boolean | undefined>();
    }

    get optionToValue(): Map<string, boolean | undefined> {
        return this._optionToValue;
    }

    getOptionValue(option: PointPredicateLogicOption | string): boolean | undefined {
        return this._optionToValue.get(option);
    }

    setOptionValue(option: PointPredicateLogicOption | string, value: boolean) {
        return this._optionToValue.set(option, value);
    }

    override(otherConfiguration: PointPredicateLogicConfiguration): this {
        for (const option of otherConfiguration.optionToValue.keys()) {
            this._optionToValue.set(option, otherConfiguration.getOptionValue(option));
        }
        return this;
    }

    clone(): PointPredicateLogicConfiguration {
        return new PointPredicateLogicConfiguration(this._optionToValue);
    }
}