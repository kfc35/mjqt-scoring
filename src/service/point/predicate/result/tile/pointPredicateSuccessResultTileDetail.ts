import { Tile } from "model/tile/tile";

export default class PointPredicateSuccessResultTileDetail {
    protected _tilesThatSatisfyPredicate: Tile[][];

    constructor(tilesThatSatisfyPredicate: Tile[][]
    ) {
        this._tilesThatSatisfyPredicate = tilesThatSatisfyPredicate;
    }

    static Builder = class {
        _tilesThatSatisfyPredicate: Tile[][] = [];

        tilesThatSatisfyPredicate(tilesThatSatisfyPredicate: Tile[][]) {
            this._tilesThatSatisfyPredicate = tilesThatSatisfyPredicate;
            return this;
        }

        build(): PointPredicateSuccessResultTileDetail {
            const tileDetail = new PointPredicateSuccessResultTileDetail(
                this._tilesThatSatisfyPredicate
            );
            return tileDetail;
        }
    }
}