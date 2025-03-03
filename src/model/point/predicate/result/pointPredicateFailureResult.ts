import { PointPredicateFailureResultMeldDetail } from "model/point/predicate/result/meldBased/pointPredicateFailureResultMeldDetail";
import { PointPredicateResult } from "model/point/predicate/result/pointPredicateResult";
import { PointPredicateFailureResultTileDetail } from "model/point/predicate/result/tile/pointPredicateFailureResultTileDetail";

export class PointPredicateFailureResult extends PointPredicateResult{
    private _meldDetail: PointPredicateFailureResultMeldDetail | undefined;
    private _tileDetail: PointPredicateFailureResultTileDetail | undefined;

    constructor(pointPredicateId: string, 
        meldDetail?: PointPredicateFailureResultMeldDetail | undefined,
        tileDetail?: PointPredicateFailureResultTileDetail | undefined) {
            if (!pointPredicateId || pointPredicateId === "") {
                throw new Error('pointPredicateId cannot both be undefined.');
            }
            super(pointPredicateId, false, []);
            this._meldDetail = meldDetail;
            this._tileDetail = tileDetail;
        }

    get meldDetail(): PointPredicateFailureResultMeldDetail | undefined {
        return this._meldDetail;
    }

    get tileDetail(): PointPredicateFailureResultTileDetail | undefined {
        return this._tileDetail;
    }

    static Builder = class {
        _pointPredicateId: string = "";
        _meldDetail: PointPredicateFailureResultMeldDetail | undefined;
        _tileDetail: PointPredicateFailureResultTileDetail | undefined;

        pointPredicateId(pointPredicateId: string) {
            this._pointPredicateId = pointPredicateId;
            return this;
        }

        meldDetail(meldDetail: PointPredicateFailureResultMeldDetail) {
            this._meldDetail = meldDetail;
            return this;
        }

        tileDetail(tileDetail: PointPredicateFailureResultTileDetail) {
            this._tileDetail = tileDetail;
            return this;
        }

        build(): PointPredicateFailureResult {
            const successResult = new PointPredicateFailureResult(
                this._pointPredicateId, this._meldDetail, this._tileDetail);
            return successResult;
        }
    }
}