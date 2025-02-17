import { PointPredicateID } from "model/point/predicate/pointPredicateID";

export default class PointPredicateBaseConfiguration {
    private _enabled: boolean;
    private _points: number;
    // i.e. all one suit includes points from all one suit and honors, so pts from the latter should be ignored
    // a "fully concealed" hand includes a regular concealed hand, so pts from the latter should be ignored
    private _includedPointPredicates: Set<PointPredicateID>

    constructor(enabled: boolean, points: number, includedPointPredicates: Set<PointPredicateID>) {
        this._enabled = enabled;
        this._points = points;
        this._includedPointPredicates = new Set(includedPointPredicates);
    }

    get enabled(): boolean {
        return this._enabled;
    }
    
    get points(): number {
        return this._points;
    }

    get includedPointPredicates(): ReadonlySet<PointPredicateID> {
        return this._includedPointPredicates;
    }

    clone(): PointPredicateBaseConfiguration {
        return new PointPredicateBaseConfiguration(this._enabled, this._points, this._includedPointPredicates);
    }
}