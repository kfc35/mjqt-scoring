import { Meld } from "model/meld/meld";

export class PointPredicateFailureResultMeldDetail {
    protected _meldsThatPartiallySatisfyPredicate: Meld[];
    protected _meldIndicesThatPartiallySatisfyPredicate: Set<number>;

    protected _meldsThatFailPredicate: Meld[];
    protected _meldIndicesThatFailPredicate: Set<number>;

    protected _meldsThatAreMissingToSatisfyPredicate: Meld[];

    constructor(meldsThatPartiallySatisfyPredicate: Meld[],
        meldIndicesThatPartiallySatisfyPredicate: Set<number>,
        meldsThatFailPredicate: Meld[],
        meldIndicesThatFailPredicate: Set<number>,
        meldsThatAreMissingToSatisfyPredicate: Meld[]
    ) {
        this._meldsThatPartiallySatisfyPredicate = meldsThatPartiallySatisfyPredicate;
        this._meldIndicesThatPartiallySatisfyPredicate = meldIndicesThatPartiallySatisfyPredicate;
        this._meldsThatFailPredicate = meldsThatFailPredicate;
        this._meldIndicesThatFailPredicate = meldIndicesThatFailPredicate;
        this._meldsThatAreMissingToSatisfyPredicate = meldsThatAreMissingToSatisfyPredicate;
    }

    get meldsThatPartiallySatisfyPredicate(): ReadonlyArray<Meld> {
        return this._meldsThatPartiallySatisfyPredicate;
    }

    get meldIndicesThatPartiallySatisfyPredicate(): ReadonlySet<number> {
        return this._meldIndicesThatPartiallySatisfyPredicate;
    }

    get meldsThatFailPredicate(): ReadonlyArray<Meld> {
        return this._meldsThatFailPredicate;
    }

    get meldIndicesThatFailPredicate(): ReadonlySet<number> {
        return this._meldIndicesThatFailPredicate;
    }

    get meldsThatAreMissingToSatisfyPredicate(): ReadonlyArray<Meld> {
        return this._meldsThatAreMissingToSatisfyPredicate;
    }

    static Builder = class {
        _meldsThatPartiallySatisfyPredicate: Meld[] = [];
        _meldIndicesThatPartiallySatisfyPredicate: Set<number> = new Set();

        _meldsThatFailPredicate: Meld[] = [];
        _meldIndicesThatFailPredicate: Set<number> = new Set();
        
        _meldsThatAreMissingToSatisfyPredicate: Meld[] = [];

        meldsThatPartiallySatisfyPredicate(meldsThatPartiallySatisfyPredicate: Meld[]) {
            this._meldsThatPartiallySatisfyPredicate = meldsThatPartiallySatisfyPredicate;
            return this;
        }
    
        meldIndicesThatPartiallySatisfyPredicate(meldIndicesThatPartiallySatisfyPredicate: Set<number>) {
            this._meldIndicesThatPartiallySatisfyPredicate = meldIndicesThatPartiallySatisfyPredicate;
            return this;
        }
    
        meldsThatFailPredicate(meldsThatFailPredicate: Meld[]) {
            this._meldsThatFailPredicate = meldsThatFailPredicate;
            return this;
        }
    
        meldIndicesThatFailPredicate(meldIndicesThatFailPredicate: Set<number>) {
            this._meldIndicesThatFailPredicate = meldIndicesThatFailPredicate;
            return this;
        }

        meldsThatAreMissingToSatisfyPredicate(meldsThatAreMissingToSatisfyPredicate: Meld[]) {
            this._meldsThatAreMissingToSatisfyPredicate = meldsThatAreMissingToSatisfyPredicate;
            return this;
        }
    
        build() : PointPredicateFailureResultMeldDetail {
            const meldDetail = new PointPredicateFailureResultMeldDetail(
                this._meldsThatPartiallySatisfyPredicate,
                this._meldIndicesThatPartiallySatisfyPredicate,

                this._meldsThatFailPredicate, 
                this._meldIndicesThatFailPredicate,

                this._meldsThatAreMissingToSatisfyPredicate,
            );
            return meldDetail;
        }
    }
}