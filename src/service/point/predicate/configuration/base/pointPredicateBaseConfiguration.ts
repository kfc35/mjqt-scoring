import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export default class PointPredicateBaseConfiguration {
    private _enabled: boolean;
    private _points: number;
    private _ignorePointPredicates: Set<PointPredicateID>

    constructor(enabled: boolean, points: number, ignorePointPredicates: Set<PointPredicateID>) {
        this._enabled = enabled;
        this._points = points;
        this._ignorePointPredicates = new Set(ignorePointPredicates);
    }

    get enabled(): boolean {
        return this._enabled;
    }
    
    get points(): number {
        return this._points;
    }

    get ignoredPointPredicates(): ReadonlySet<PointPredicateID> {
        return this._ignorePointPredicates;
    }

    clone(): PointPredicateBaseConfiguration {
        return new PointPredicateBaseConfiguration(this._enabled, this._points, this._ignorePointPredicates);
    }
}