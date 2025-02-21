import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export const MAX_POINTS = `MAX` as const;
export type pointType = number | typeof MAX_POINTS;

export default class PointPredicateBaseConfiguration {
    private _enabled: boolean;
    private _points: pointType;
    private _isBonus: boolean;

    // i.e. all one suit includes points from all one suit and honors, so pts from the latter should be ignored
    // a "fully concealed" hand includes a regular concealed hand, so pts from the latter should be ignored
    private _includedPointPredicates: Set<PointPredicateID>

    constructor(enabled: boolean, 
        points: pointType, 
        isBonus: boolean,
        includedPointPredicates: Set<PointPredicateID>) {
        this._enabled = enabled;
        this._points = points;
        this._isBonus = isBonus;
        this._includedPointPredicates = new Set(includedPointPredicates);
    }

    get enabled(): boolean {
        return this._enabled;
    }
    
    get points(): pointType {
        return this._points;
    }

    get isBonus(): boolean {
        return this._isBonus;
    }

    get includedPointPredicates(): ReadonlySet<PointPredicateID> {
        return this._includedPointPredicates;
    }

    static Builder = class {
        _enabled: boolean = true;
        _points: pointType = 0;
        _isBonus: boolean = false;
        _includedPointPredicates: Set<PointPredicateID> = new Set();

        enabled(enabled: boolean) {
            this._enabled = enabled;
            return this;
        }

        points(points: pointType) {
            this._points = points;
            return this;
        }
        
        isBonus(isBonus: boolean) {
            this._isBonus = isBonus;
            return this;
        }

        addIncludedPointPredicate(pointPredicateId: PointPredicateID) {
            this._includedPointPredicates.add(pointPredicateId);
            return this;
        }

        build() : PointPredicateBaseConfiguration {
            return new PointPredicateBaseConfiguration(this._enabled, this._points, this._isBonus, this._includedPointPredicates);
        }
    }

    clone(): PointPredicateBaseConfiguration {
        return new PointPredicateBaseConfiguration(this._enabled, this._points, this._isBonus, this._includedPointPredicates);
    }
}