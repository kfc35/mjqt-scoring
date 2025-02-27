import { Meld } from "model/meld/meld";

export class PointPredicateSuccessResultMeldDetail {
    protected _meldsThatSatisfyPredicate: Meld[];
    // indices refer to melds[] from the associated WinningHand 
    protected _meldIndicesThatSatisfyPredicate: Set<number>;

    constructor(meldsThatSatisfyPredicate: Meld[],
        meldIndicesThatSatisfyPredicate: Set<number>,
    ) {
        this._meldsThatSatisfyPredicate = meldsThatSatisfyPredicate;
        this._meldIndicesThatSatisfyPredicate = meldIndicesThatSatisfyPredicate;

    }

    static Builder = class {
        _meldsThatSatisfyPredicate: Meld[] = [];
        _meldIndicesThatSatisfyPredicate: Set<number> = new Set();

        meldsThatSatisfyPredicate(meldsThatSatisfyPredicate: Meld[]) {
            this._meldsThatSatisfyPredicate = meldsThatSatisfyPredicate;
            return this;
        }

        meldIndicesThatSatisfyPredicate(meldIndicesThatSatisfyPredicate: Set<number>) {
            this._meldIndicesThatSatisfyPredicate = meldIndicesThatSatisfyPredicate;
            return this;
        }

        build() : PointPredicateSuccessResultMeldDetail {
            const meldDetail = new PointPredicateSuccessResultMeldDetail(
                this._meldsThatSatisfyPredicate, 
                this._meldIndicesThatSatisfyPredicate
            );
            return meldDetail;
        }
    }
}