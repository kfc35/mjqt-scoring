import { WindDirection, windDirectionToWindTile, windDirectionToSeasonTile, windDirectionToGentlemanTile } from "model/roundContext/windDirection";
import GentlemanTile from "model/tile/group/gentlemanTile";
import SeasonTile from "model/tile/group/seasonTile";
import WindTile from "model/tile/group/windTile";

export class RoundContext {
    private _prevailingWind : WindDirection;
    private _seatWind : WindDirection;

    constructor(prevailingWind: WindDirection, seatWind: WindDirection) {
        this._prevailingWind = prevailingWind;
        this._seatWind = seatWind;
    }

    get prevailingWind(): WindDirection {
        return this._prevailingWind;
    }

    getPrevailingWindAsWindTile(): WindTile {
        return windDirectionToWindTile(this._prevailingWind);
    }

    getPrevailingWindAsSeasonTile(): SeasonTile {
        return windDirectionToSeasonTile(this._prevailingWind);
    }

    getPrevailingWindAsGentlemanTile(): GentlemanTile {
        return windDirectionToGentlemanTile(this._prevailingWind);
    }

    get seatWind(): WindDirection {
        return this._seatWind;
    }

    getSeatWindAsWindTile(): WindTile {
        return windDirectionToWindTile(this._seatWind);
    }

    getSeatWindAsSeasonTile(): SeasonTile {
        return windDirectionToSeasonTile(this._seatWind);
    }

    getSeatWindAsGentlemanTile(): GentlemanTile {
        return windDirectionToGentlemanTile(this._seatWind);
    }
}