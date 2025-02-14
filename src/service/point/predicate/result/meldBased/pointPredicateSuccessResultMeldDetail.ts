import Meld from "model/meld/meld";
import { Tile } from "model/tile/tile";

export default class PointPredicateSuccessResultMeldDetail {
    protected _meldsThatSatisfyPredicate: Meld[];
    // indices refer to melds[] from the associated WinningHand 
    protected _meldIndicesThatSatisfyPredicate: Set<number>;
    protected _tilesThatSatisfyPredicate: Tile[][];

    constructor(meldsThatSatisfyPredicate: Meld[],
        meldIndicesThatSatisfyPredicate: Set<number>,
        tilesThatSatisfyPredicate: Tile[][],
    ) {
        this._meldsThatSatisfyPredicate = meldsThatSatisfyPredicate;
        this._meldIndicesThatSatisfyPredicate = meldIndicesThatSatisfyPredicate;
        this._tilesThatSatisfyPredicate = tilesThatSatisfyPredicate;

    }

    static Builder = class {
        _meldsThatSatisfyPredicate: Meld[] = [];
        _meldIndicesThatSatisfyPredicate: Set<number> = new Set();
        _tilesThatSatisfyPredicate: Tile[][] = []

        meldsThatSatisfyPredicate(meldsThatSatisfyPredicate: Meld[]) {
            this._meldsThatSatisfyPredicate = meldsThatSatisfyPredicate;
        }

        meldIndicesThatSatisfyPredicate(meldIndicesThatSatisfyPredicate: Set<number>) {
            this._meldIndicesThatSatisfyPredicate = meldIndicesThatSatisfyPredicate;
        }

        tilesThatSatisfyPredicate(tilesThatSatisfyPredicate: Tile[][]) {
            this._tilesThatSatisfyPredicate = tilesThatSatisfyPredicate;
        }

        build() {
            const meldDetail = new PointPredicateSuccessResultMeldDetail(
                this._meldsThatSatisfyPredicate, 
                this._meldIndicesThatSatisfyPredicate,
                this._tilesThatSatisfyPredicate
            );
            return meldDetail;
        }
    }
}