import { PointPredicateSuccessResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateSuccessResultMeldDetail";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateSuccessResultTileDetail } from "model/point/predicate/result/tile/pointPredicateSuccessResultTileDetail";

export class PointPredicateSingleSuccessResult extends PointPredicateResult {
    private _meldDetail: PointPredicateSuccessResultMeldDetail | undefined;
    private _tileDetail: PointPredicateSuccessResultTileDetail | undefined;

    constructor(pointPredicateId: string, 
        meldDetail?: PointPredicateSuccessResultMeldDetail | undefined,
        tileDetail?: PointPredicateSuccessResultTileDetail | undefined) {
            if (pointPredicateId.trim() === "") {
                throw new Error('pointPredicateId cannot be empty / just spaces.');
            }
            super(pointPredicateId, true, []);
            this._meldDetail = meldDetail;
            this._tileDetail = tileDetail;
        }

    get meldDetail(): PointPredicateSuccessResultMeldDetail | undefined {
        return this._meldDetail;
    }

    get tileDetail(): PointPredicateSuccessResultTileDetail | undefined {
        return this._tileDetail;
    }

    static Builder = class {
        _pointPredicateId: string = "";
        _meldDetail: PointPredicateSuccessResultMeldDetail | undefined;
        _tileDetail: PointPredicateSuccessResultTileDetail | undefined;

        pointPredicateId(pointPredicateId: string) {
            this._pointPredicateId = pointPredicateId;
            return this;
        }

        meldDetail(meldDetail: PointPredicateSuccessResultMeldDetail) {
            this._meldDetail = meldDetail;
            return this;
        }

        tileDetail(tileDetail: PointPredicateSuccessResultTileDetail) {
            this._tileDetail = tileDetail;
            return this;
        }

        build() : PointPredicateSingleSuccessResult {
            const successResult = new PointPredicateSingleSuccessResult(
                this._pointPredicateId, this._meldDetail, this._tileDetail);
            return successResult;
        }
    }
}