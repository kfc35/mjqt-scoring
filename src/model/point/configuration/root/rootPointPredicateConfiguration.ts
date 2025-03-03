import { PointPredicateBaseConfiguration } from "model/point/configuration/base/pointPredicateBaseConfiguration";
import { PointPredicateLogicConfiguration } from "model/point/configuration/logic/pointPredicateLogicConfiguration";

export class RootPointPredicateConfiguration {
    private _pointPredicateIdToBaseConfiguration: Map<string, PointPredicateBaseConfiguration>;
    private _pointPredicateLogicConfiguration: PointPredicateLogicConfiguration;
    private _maxPoints: number;
    
    constructor(maxPoints: number) { 
        this._pointPredicateIdToBaseConfiguration = new Map();
        this._pointPredicateLogicConfiguration = new PointPredicateLogicConfiguration();
        this._maxPoints = maxPoints;
    }

    get pointPredicateIdToBaseConfiguration() {
        return this._pointPredicateIdToBaseConfiguration;
    }

    getBaseConfiguration(pointPredicateId: string): PointPredicateBaseConfiguration | undefined {
        return this._pointPredicateIdToBaseConfiguration.get(pointPredicateId);
    }

    setBaseConfiguration(pointPredicateId: string, baseConfig: PointPredicateBaseConfiguration): this {
        this._pointPredicateIdToBaseConfiguration.set(pointPredicateId, baseConfig);
        return this;
    }

    importBaseConfigurationMap(baseConfigurationMap: Map<string, PointPredicateBaseConfiguration>) {
        baseConfigurationMap.forEach((val, key) => this._pointPredicateIdToBaseConfiguration.set(key, val.clone()));
    }

    get pointPredicateLogicConfiguration() {
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