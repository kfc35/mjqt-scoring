import Meld from "model/meld/meld";
import { Tile } from "model/tile/tile";

export default class PointPredicateFailureResultMeldDetail {
    protected _meldsThatPartiallySatisfyPredicate: Meld[];
    protected _meldIndicesThatPartiallySatisfyPredicate: Set<number>;
    protected _tilesThatPartiallySatisfyPredicate: Tile[][];

    protected _meldsThatFailPredicate: Meld[];
    protected _meldIndicesThatFailPredicate: Set<number>;
    protected _tilesThatFailPredicate: Tile[][];

    protected _meldsThatAreMissingToSatisfyPredicate: Meld[];
    protected _tilesThatAreMissingToSatisfyPredicate: Tile[][];

    constructor(meldsThatPartiallySatisfyPredicate: Meld[],
        meldIndicesThatPartiallySatisfyPredicate: Set<number>,
        tilesThatPartiallySatisfyPredicate: Tile[][],
        meldsThatFailPredicate: Meld[],
        meldIndicesThatFailPredicate: Set<number>,
        tilesThatFailPredicate: Tile[][],
        meldsThatAreMissingToSatisfyPredicate: Meld[],
        tilesThatAreMissingToSatisfyPredicate: Tile[][],
    ) {
        this._meldsThatPartiallySatisfyPredicate = meldsThatPartiallySatisfyPredicate;
        this._meldIndicesThatPartiallySatisfyPredicate = meldIndicesThatPartiallySatisfyPredicate;
        this._tilesThatPartiallySatisfyPredicate = tilesThatPartiallySatisfyPredicate;
        this._meldsThatFailPredicate = meldsThatFailPredicate;
        this._meldIndicesThatFailPredicate = meldIndicesThatFailPredicate;
        this._tilesThatFailPredicate = tilesThatFailPredicate;
        this._meldsThatAreMissingToSatisfyPredicate = meldsThatAreMissingToSatisfyPredicate;
        this._tilesThatAreMissingToSatisfyPredicate = tilesThatAreMissingToSatisfyPredicate;
    }

    static Builder = class {
        _meldsThatPartiallySatisfyPredicate: Meld[] = [];
        _meldIndicesThatPartiallySatisfyPredicate: Set<number> = new Set();
        _tilesThatPartiallySatisfyPredicate: Tile[][] = [];

        _meldsThatFailPredicate: Meld[] = [];
        _meldIndicesThatFailPredicate: Set<number> = new Set();
        _tilesThatFailPredicate: Tile[][] = [];
        
        _meldsThatAreMissingToSatisfyPredicate: Meld[] = [];
        _tilesThatAreMissingToSatisfyPredicate: Tile[][] = [];

        meldsThatPartiallySatisfyPredicate(meldsThatPartiallySatisfyPredicate: Meld[]) {
            this._meldsThatPartiallySatisfyPredicate = meldsThatPartiallySatisfyPredicate;
        }
    
        meldIndicesThatPartiallySatisfyPredicate(meldIndicesThatPartiallySatisfyPredicate: Set<number>) {
            this._meldIndicesThatPartiallySatisfyPredicate = meldIndicesThatPartiallySatisfyPredicate;
        }

        tilesThatPartiallySatisfyPredicate(tilesThatPartiallySatisfyPredicate: Tile[][]) {
            this._tilesThatPartiallySatisfyPredicate = tilesThatPartiallySatisfyPredicate;
        }
    
        meldsThatFailPredicate(meldsThatFailPredicate: Meld[]) {
            this._meldsThatFailPredicate = meldsThatFailPredicate;
        }
    
        meldIndicesThatFailPredicate(meldIndicesThatFailPredicate: Set<number>) {
            this._meldIndicesThatFailPredicate = meldIndicesThatFailPredicate;
        }
    
        tilesThatFailPredicate(tilesThatFailPredicate: Tile[][]) {
            this._tilesThatFailPredicate = tilesThatFailPredicate;
        }

        meldsThatAreMissingToSatisfyPredicate(meldsThatAreMissingToSatisfyPredicate: Meld[]) {
            this._meldsThatAreMissingToSatisfyPredicate = meldsThatAreMissingToSatisfyPredicate;
        }

        tilesThatAreMissingToSatisfyPredicate(tilesThatAreMissingToSatisfyPredicate: Tile[][]) {
            this._tilesThatAreMissingToSatisfyPredicate = tilesThatAreMissingToSatisfyPredicate;
        }
    
        build() {
            const meldDetail = new PointPredicateFailureResultMeldDetail(
                this._meldsThatPartiallySatisfyPredicate,
                this._meldIndicesThatPartiallySatisfyPredicate,
                this._tilesThatPartiallySatisfyPredicate,
                this._meldsThatFailPredicate, 
                this._meldIndicesThatFailPredicate,
                this._tilesThatFailPredicate,
                this._meldsThatAreMissingToSatisfyPredicate,
                this._tilesThatAreMissingToSatisfyPredicate
            );
            return meldDetail;
        }
    }
}