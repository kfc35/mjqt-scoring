import { Tile } from "model/tile/tile";

export class PointPredicateSuccessResultTileDetail {
    protected _tilesThatSatisfyPredicate: Tile[][];

    constructor(tilesThatSatisfyPredicate: Tile[][]
    ) {
        this._tilesThatSatisfyPredicate = tilesThatSatisfyPredicate;
    }

    get tilesThatSatisfyPredicate(): ReadonlyArray<ReadonlyArray<Tile>> {
        return this._tilesThatSatisfyPredicate;
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