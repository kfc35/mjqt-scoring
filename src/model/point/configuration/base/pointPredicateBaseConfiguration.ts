import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateLogicConfiguration } from "../logic/pointPredicateLogicConfiguration";
import type { PointType } from "model/point/configuration/base/pointType";

export class PointPredicateBaseConfiguration {
    private _enabled: boolean;
    private _points: PointType; 
    private _isBonus: boolean;

    // i.e. all one suit includes points from all one suit and honors, so pts from the latter should be ignored
    // a "fully concealed" hand includes a regular concealed hand, so pts from the latter should be ignored
    // some included point predicates can shift based on the logic config.
    private _includedPointPredicatesGenerator: (logicConfig: PointPredicateLogicConfiguration) => Set<PointPredicateID>

    constructor(enabled: boolean, 
        points: PointType, 
        isBonus: boolean,
        includedPointPredicatesGenerator: (logicConfig: PointPredicateLogicConfiguration) => Set<PointPredicateID>) {
        this._enabled = enabled;
        this._points = points;
        this._isBonus = isBonus;
        this._includedPointPredicatesGenerator = includedPointPredicatesGenerator;
    }

    get enabled(): boolean {
        return this._enabled;
    }
    
    get points(): PointType {
        return this._points;
    }

    get isBonus(): boolean {
        return this._isBonus;
    }

    set enabled(enabled: boolean) {
        this._enabled = enabled;
    }
    
    set points(points: PointType) {
        this._points = points;
    }

    set isBonus(isBonus: boolean) {
        this._isBonus = isBonus;
    }

    generateIncludedPointPredicates(logicConfig: PointPredicateLogicConfiguration): ReadonlySet<PointPredicateID> {
        return this._includedPointPredicatesGenerator(logicConfig);
    }

    static Builder = class {
        _enabled: boolean = true;
        _points: PointType = 0;
        _isBonus: boolean = false;
        _includedPointPredicatesGenerator: (logicConfig: PointPredicateLogicConfiguration) => Set<PointPredicateID> 
            = () => new Set();

        enabled(enabled: boolean) {
            this._enabled = enabled;
            return this;
        }

        points(points: PointType) {
            this._points = points;
            return this;
        }
        
        isBonus(isBonus: boolean) {
            this._isBonus = isBonus;
            return this;
        }

        includedPointPredicatesGenerator(generator: (logicConfig: PointPredicateLogicConfiguration) => Set<PointPredicateID> ) {
            this._includedPointPredicatesGenerator = generator;
            return this;
        }

        build() : PointPredicateBaseConfiguration {
            return new PointPredicateBaseConfiguration(this._enabled, this._points, this._isBonus, this._includedPointPredicatesGenerator);
        }
    }

    clone(): PointPredicateBaseConfiguration {
        return new PointPredicateBaseConfiguration(this._enabled, this._points, this._isBonus, this._includedPointPredicatesGenerator);
    }
}