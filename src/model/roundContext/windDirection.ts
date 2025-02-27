import { GentlemanTileValue, WindTileValue } from "model/tile/tileValue";
import { WindTile } from "model/tile/group/windTile";
import { SeasonTileValue } from "model/tile/tileValue";
import { SeasonTile } from "model/tile/group/seasonTile";
import { GentlemanTile } from "model/tile/group/gentlemanTile";
import { getEnumKeys } from "common/generic/enumUtils";

export enum WindDirection {
    EAST = 'EAST',
    SOUTH = 'SOUTH',
    WEST = 'WEST',
    NORTH = 'NORTH'
}

export const windDirections : WindDirection[] = 
    getEnumKeys(WindDirection).map(key => WindDirection[key]);

export function windDirectionToWindTile(windDirection: WindDirection) : WindTile {
    switch (windDirection) {
        case WindDirection.EAST:
            return new WindTile(WindTileValue.EAST);
        case WindDirection.SOUTH:
            return new WindTile(WindTileValue.SOUTH);
        case WindDirection.WEST:
            return new WindTile(WindTileValue.WEST);
        case WindDirection.NORTH:
            return new WindTile(WindTileValue.NORTH);
    }
}

export function windDirectionToSeasonTile(windDirection: WindDirection) : SeasonTile {
    switch (windDirection) {
        case WindDirection.EAST:
            return new SeasonTile(SeasonTileValue.SPRING);
        case WindDirection.SOUTH:
            return new SeasonTile(SeasonTileValue.SUMMER);
        case WindDirection.WEST:
            return new SeasonTile(SeasonTileValue.AUTUMN);
        case WindDirection.NORTH:
            return new SeasonTile(SeasonTileValue.WINTER);
    }
}

export function windDirectionToGentlemanTile(windDirection: WindDirection) : GentlemanTile {
    switch (windDirection) {
        case WindDirection.EAST:
            return new GentlemanTile(GentlemanTileValue.PLUM);
        case WindDirection.SOUTH:
            return new GentlemanTile(GentlemanTileValue.ORCHID);
        case WindDirection.WEST:
            return new GentlemanTile(GentlemanTileValue.CHRYSANTHEMUM);
        case WindDirection.NORTH:
            return new GentlemanTile(GentlemanTileValue.BAMBOO);
    }
}