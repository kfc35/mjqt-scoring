import { Tile } from "model/tile/tile";

export default class PointPredicateFailureResultTileDetail {
    protected _tilesThatPartiallySatisfyPredicate: Tile[][];

    protected _tilesThatFailPredicate: Tile[][];

    protected _tilesThatAreMissingToSatisfyPredicate: Tile[][];

    constructor(tilesThatPartiallySatisfyPredicate: Tile[][],
        tilesThatFailPredicate: Tile[][],
        tilesThatAreMissingToSatisfyPredicate: Tile[][],
    ) {
        this._tilesThatPartiallySatisfyPredicate = tilesThatPartiallySatisfyPredicate;
        this._tilesThatFailPredicate = tilesThatFailPredicate;
        this._tilesThatAreMissingToSatisfyPredicate = tilesThatAreMissingToSatisfyPredicate;
    }

    static Builder = class {
        _tilesThatPartiallySatisfyPredicate: Tile[][] = [];

        _tilesThatFailPredicate: Tile[][] = [];
        
        _tilesThatAreMissingToSatisfyPredicate: Tile[][] = [];

        tilesThatPartiallySatisfyPredicate(tilesThatPartiallySatisfyPredicate: Tile[][]) {
            this._tilesThatPartiallySatisfyPredicate = tilesThatPartiallySatisfyPredicate;
            return this;
        }

        tilesThatFailPredicate(tilesThatFailPredicate: Tile[][]) {
            this._tilesThatFailPredicate = tilesThatFailPredicate;
            return this;
        }

        tilesThatAreMissingToSatisfyPredicate(tilesThatAreMissingToSatisfyPredicate: Tile[][]) {
            this._tilesThatAreMissingToSatisfyPredicate = tilesThatAreMissingToSatisfyPredicate;
            return this;
        }
    
        build(): PointPredicateFailureResultTileDetail {
            const tileDetail = new PointPredicateFailureResultTileDetail(
                this._tilesThatPartiallySatisfyPredicate,
                this._tilesThatFailPredicate,
                this._tilesThatAreMissingToSatisfyPredicate
            );
            return tileDetail;
        }
    }
}