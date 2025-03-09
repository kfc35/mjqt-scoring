import { RoundContext } from "model/roundContext/roundContext";
import { WindDirection } from "model/roundContext/windDirection";
import { GentlemanTileValue, SeasonTileValue, WindTileValue } from "model/tile/tileValue";
import { GentlemanTile } from "model/tile/group/gentlemanTile";
import { WindTile } from "model/tile/group/windTile";
import { SeasonTile } from "model/tile/group/seasonTile";

describe('roundContext.ts', () => {
    describe('prevailing wind = seat wind', () => {
        const roundContext = new RoundContext(WindDirection.SOUTH, WindDirection.SOUTH);
        
        test('has expected field values', () => {
            expect(roundContext.otherWinds).toEqual(expect.arrayContaining([WindDirection.EAST, WindDirection.NORTH, WindDirection.WEST]));
            expect(roundContext.otherWinds.length).toBe(3);
            expect(roundContext.prevailingWind).toBe(WindDirection.SOUTH);
            expect(roundContext.seatWind).toBe(WindDirection.SOUTH);

            expect(roundContext.getPrevailingWindAsGentlemanTile()).toStrictEqual(new GentlemanTile(GentlemanTileValue.ORCHID))
            expect(roundContext.getPrevailingWindAsSeasonTile()).toStrictEqual(new SeasonTile(SeasonTileValue.SUMMER))
            expect(roundContext.getPrevailingWindAsWindTile()).toStrictEqual(new WindTile(WindTileValue.SOUTH))
            expect(roundContext.getSeatWindAsGentlemanTile()).toStrictEqual(new GentlemanTile(GentlemanTileValue.ORCHID))
            expect(roundContext.getSeatWindAsSeasonTile()).toStrictEqual(new SeasonTile(SeasonTileValue.SUMMER))
            expect(roundContext.getSeatWindAsWindTile()).toStrictEqual(new WindTile(WindTileValue.SOUTH))
        });
    })

    describe('prevailing wind != seat wind', () => {
        const roundContext = new RoundContext(WindDirection.EAST, WindDirection.NORTH);
        
        test('has expected field values', () => {
            expect(roundContext.otherWinds).toEqual(expect.arrayContaining([WindDirection.SOUTH, WindDirection.WEST]));
            expect(roundContext.otherWinds.length).toBe(2);
            expect(roundContext.prevailingWind).toBe(WindDirection.EAST);
            expect(roundContext.seatWind).toBe(WindDirection.NORTH);


            expect(roundContext.getPrevailingWindAsGentlemanTile()).toStrictEqual(new GentlemanTile(GentlemanTileValue.PLUM))
            expect(roundContext.getPrevailingWindAsSeasonTile()).toStrictEqual(new SeasonTile(SeasonTileValue.SPRING))
            expect(roundContext.getPrevailingWindAsWindTile()).toStrictEqual(new WindTile(WindTileValue.EAST))
            expect(roundContext.getSeatWindAsGentlemanTile()).toStrictEqual(new GentlemanTile(GentlemanTileValue.BAMBOO))
            expect(roundContext.getSeatWindAsSeasonTile()).toStrictEqual(new SeasonTile(SeasonTileValue.WINTER))
            expect(roundContext.getSeatWindAsWindTile()).toStrictEqual(new WindTile(WindTileValue.NORTH))
        });
    })
});