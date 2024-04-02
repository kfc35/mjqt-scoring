import WindTile from "model/tile/group/windTile";
import { WindTileValue } from "model/tile/tileValue";

export enum SeatWind {
    EAST = 'EAST', // Player one
    SOUTH = 'SOUTH', // two
    WEST = 'WEST', // three
    NORTH = 'NORTH' // four
}

export function seatWindToWindTile(seatWind: SeatWind) : WindTile {
    switch (seatWind) {
        case SeatWind.EAST:
            return new WindTile(WindTileValue.EAST);
        case SeatWind.SOUTH:
            return new WindTile(WindTileValue.SOUTH);
        case SeatWind.WEST:
            return new WindTile(WindTileValue.WEST);
        case SeatWind.NORTH:
            return new WindTile(WindTileValue.NORTH);
    }
}