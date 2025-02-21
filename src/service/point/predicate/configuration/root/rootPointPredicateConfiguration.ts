import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import PointPredicateBaseConfiguration from "service/point/predicate/configuration/base/pointPredicateBaseConfiguration";
import { PointPredicateLogicConfiguration } from "service/point/predicate/configuration/logic/pointPredicateLogicConfiguration";

export class RootPointPredicateConfiguration {
    private _pointPredicateIdToBaseConfiguration: Map<PointPredicateID, PointPredicateBaseConfiguration>;
    private _pointPredicateLogicConfiguration: PointPredicateLogicConfiguration;
    private _maxPoints: number;
    
    constructor(maxPoints: number) { 
        this._pointPredicateIdToBaseConfiguration = new Map();
        this._pointPredicateLogicConfiguration = new PointPredicateLogicConfiguration();
        this._maxPoints = maxPoints;
    }

    getBaseConfiguration(pointPredicateId: PointPredicateID): PointPredicateBaseConfiguration | undefined {
        return this._pointPredicateIdToBaseConfiguration.get(pointPredicateId);
    }

    setBaseConfiguration(pointPredicateId: PointPredicateID, baseConfig: PointPredicateBaseConfiguration): this {
        this._pointPredicateIdToBaseConfiguration.set(pointPredicateId, baseConfig);
        return this;
    }

    importBaseConfigurationMap(baseConfigurationMap: Map<PointPredicateID, PointPredicateBaseConfiguration>) {
        baseConfigurationMap.forEach((val, key) => this._pointPredicateIdToBaseConfiguration.set(key, val.clone()));
    }

    getLogicConfiguration() {
        return this._pointPredicateLogicConfiguration;
    }

    setLogicConfiguration(logicConfig: PointPredicateLogicConfiguration) {
        this._pointPredicateLogicConfiguration = logicConfig;
    }

    importLogicConfiguration(logicConfig: PointPredicateLogicConfiguration){
        this._pointPredicateLogicConfiguration.override(logicConfig);
    }

    get maxPoints(): number {
        return this._maxPoints;
    }

    set maxPoints(maxPoints: number) {
        this._maxPoints = maxPoints;
    }

    clone(): RootPointPredicateConfiguration {
        const clone = new RootPointPredicateConfiguration(this._maxPoints);
        for (const [id, baseConfig] of this._pointPredicateIdToBaseConfiguration.entries()) {
            clone.setBaseConfiguration(id, baseConfig.clone());
        }
        clone.setLogicConfiguration(this._pointPredicateLogicConfiguration.clone());
        return clone;
    }
}