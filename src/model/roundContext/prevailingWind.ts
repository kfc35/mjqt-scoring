import WindTile from "model/tile/group/windTile";
import { WindTileValue } from "model/tile/tileValue";

export enum PrevailingWind {
    EAST = 'EAST',
    SOUTH = 'SOUTH',
    WEST = 'WEST',
    NORTH = 'NORTH'
}

export function prevailingWindToWindTile(prevailingWind: PrevailingWind) : WindTile {
    switch (prevailingWind) {
        case PrevailingWind.EAST:
            return new WindTile(WindTileValue.EAST);
        case PrevailingWind.SOUTH:
            return new WindTile(WindTileValue.SOUTH);
        case PrevailingWind.WEST:
            return new WindTile(WindTileValue.WEST);
        case PrevailingWind.NORTH:
            return new WindTile(WindTileValue.NORTH);
    }
}