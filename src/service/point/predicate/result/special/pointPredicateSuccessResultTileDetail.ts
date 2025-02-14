import { Tile } from "model/tile/tile";

export default class PointPredicateSuccessResultTileDetail {
    protected _tilesThatSatisfyPredicate: Tile[][];
    protected _tileIndicesThatSatisfyPredicate: Set<number>;

    constructor(tilesThatSatisfyPredicate: Tile[][],
        tileIndicesThatSatisfyPredicate: Set<number>
    ) {
        this._tilesThatSatisfyPredicate = tilesThatSatisfyPredicate;
        this._tileIndicesThatSatisfyPredicate = tileIndicesThatSatisfyPredicate;

    }

    static Builder = class {
        _tilesThatSatisfyPredicate: Tile[][] = []
        _tileIndicesThatSatisfyPredicate: Set<number> = new Set();

        tileIndicesThatSatisfyPredicate(tileIndicesThatSatisfyPredicate: Set<number>) {
            this._tileIndicesThatSatisfyPredicate = tileIndicesThatSatisfyPredicate;
        }

        tilesThatSatisfyPredicate(tilesThatSatisfyPredicate: Tile[][]) {
            this._tilesThatSatisfyPredicate = tilesThatSatisfyPredicate;
        }

        build() {
            const tileDetail = new PointPredicateSuccessResultTileDetail(
                this._tilesThatSatisfyPredicate,
                this._tileIndicesThatSatisfyPredicate
            );
            return tileDetail;
        }
    }
}