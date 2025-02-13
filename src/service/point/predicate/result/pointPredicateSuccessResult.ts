//import PointPredicateResult from "./pointPredicateResult";

/**export default class PointPredicateSuccessResult extends PointPredicateResult {
    private _successTiles: Tile[][][];

    constructor(pointPredicateId: string, 
        successTiles: Tile[][][]) {
            this._pointPredicateId = pointPredicateId;
            this._successTiles = successTiles;
        }

    static Builder = class {
        _successTiles: Tile[][][] = false;

        successTiles(successTiles: Tile[][][]) {
            this._successTiles = successTiles;
        }

        build() {
            const successResult = new PointPredicateSuccessResult(
                this._successTiles;
            return successResult;
        }
    }
}**/