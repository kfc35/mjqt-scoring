import { Tile } from "model/tile/tile";

export default class PointPredicateFailureResultTileDetail {
    protected _tileIndicesThatPartiallySatisfyPredicate: Set<number>;
    protected _tilesThatPartiallySatisfyPredicate: Tile[][];

    protected _tileIndicesThatFailPredicate: Set<number>;
    protected _tilesThatFailPredicate: Tile[][];

    protected _tilesThatAreMissingToSatisfyPredicate: Tile[][];

    constructor(tileIndicesThatPartiallySatisfyPredicate: Set<number>,
        tilesThatPartiallySatisfyPredicate: Tile[][],
        tileIndicesThatFailPredicate: Set<number>,
        tilesThatFailPredicate: Tile[][],
        tilesThatAreMissingToSatisfyPredicate: Tile[][],
    ) {
        this._tileIndicesThatPartiallySatisfyPredicate = tileIndicesThatPartiallySatisfyPredicate;
        this._tilesThatPartiallySatisfyPredicate = tilesThatPartiallySatisfyPredicate;
        this._tileIndicesThatFailPredicate = tileIndicesThatFailPredicate;
        this._tilesThatFailPredicate = tilesThatFailPredicate;
        this._tilesThatAreMissingToSatisfyPredicate = tilesThatAreMissingToSatisfyPredicate;
    }

    static Builder = class {
        _tileIndicesThatPartiallySatisfyPredicate: Set<number> = new Set();
        _tilesThatPartiallySatisfyPredicate: Tile[][] = [];

        _tileIndicesThatFailPredicate: Set<number> = new Set();
        _tilesThatFailPredicate: Tile[][] = [];
        
        _tilesThatAreMissingToSatisfyPredicate: Tile[][] = [];
    
        tileIndicesThatPartiallySatisfyPredicate(tileIndicesThatPartiallySatisfyPredicate: Set<number>) {
            this._tileIndicesThatPartiallySatisfyPredicate = tileIndicesThatPartiallySatisfyPredicate;
        }

        tilesThatPartiallySatisfyPredicate(tilesThatPartiallySatisfyPredicate: Tile[][]) {
            this._tilesThatPartiallySatisfyPredicate = tilesThatPartiallySatisfyPredicate;
        }
    
        tileIndicesThatFailPredicate(tileIndicesThatFailPredicate: Set<number>) {
            this._tileIndicesThatFailPredicate = tileIndicesThatFailPredicate;
        }
    
        tilesThatFailPredicate(tilesThatFailPredicate: Tile[][]) {
            this._tilesThatFailPredicate = tilesThatFailPredicate;
        }

        tilesThatAreMissingToSatisfyPredicate(tilesThatAreMissingToSatisfyPredicate: Tile[][]) {
            this._tilesThatAreMissingToSatisfyPredicate = tilesThatAreMissingToSatisfyPredicate;
        }
    
        build() {
            const tileDetail = new PointPredicateFailureResultTileDetail(
                this._tileIndicesThatPartiallySatisfyPredicate,
                this._tilesThatPartiallySatisfyPredicate,

                this._tileIndicesThatFailPredicate,
                this._tilesThatFailPredicate,
                
                this._tilesThatAreMissingToSatisfyPredicate
            );
            return tileDetail;
        }
    }
}