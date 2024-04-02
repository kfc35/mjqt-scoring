import { PrevailingWind, prevailingWindToWindTile } from "model/roundContext/prevailingWind";
import { SeatWind, seatWindToWindTile } from "model/roundContext/seatWind";
import WindTile from "model/tile/group/windTile";

export class RoundContext {
    private _prevailingWind : PrevailingWind;
    private _seatWind : SeatWind;

    constructor(prevailingWind: PrevailingWind, seatWind: SeatWind) {
        this._prevailingWind = prevailingWind;
        this._seatWind = seatWind;
    }

    get prevailingWind(): PrevailingWind {
        return this._prevailingWind;
    }

    getPrevailingWindAsWindTile(): WindTile {
        return prevailingWindToWindTile(this._prevailingWind);
    }

    get seatWind(): SeatWind {
        return this._seatWind;
    }

    getSeatWindAsWindTile(): WindTile {
        return seatWindToWindTile(this._seatWind);
    }
}