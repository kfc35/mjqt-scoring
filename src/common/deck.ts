import { GentlemanTile } from "model/tile/group/gentlemanTile";
import { SeasonTile } from "model/tile/group/seasonTile";
import { DragonTile } from "model/tile/group/dragonTile";
import { WindTile } from "model/tile/group/windTile";
import { BambooTile } from "model/tile/group/bambooTile";
import { CharacterTile } from "model/tile/group/characterTile";
import { CircleTile } from "model/tile/group/circleTile";
import { GentlemanTileValue, SeasonTileValue, DragonTileValue, WindTileValue, SuitedTileValue } from "model/tile/tileValue";
import { SuitedTileGroup } from "model/tile/group/suitedTile";
import { TileGroup } from "model/tile/tileGroup";

export const maxQuantityPerNonFlowerTile = 4;
export const maxQuantityPerFlowerTile = 1;
// This does not use the tile constructor so that they are at their narrowest type.
export const 
    PLUM_GENTLEMAN = new GentlemanTile(GentlemanTileValue.PLUM),
    ORCHID_GENTLEMAN = new GentlemanTile(GentlemanTileValue.ORCHID),
    CHRYSANTHEMUM_GENTLEMAN = new GentlemanTile(GentlemanTileValue.CHRYSANTHEMUM),
    BAMBOO_GENTLEMAN = new GentlemanTile(GentlemanTileValue.BAMBOO),
    
    SPRING_SEASON = new SeasonTile(SeasonTileValue.SPRING),
    SUMMER_SEASON = new SeasonTile(SeasonTileValue.SUMMER),
    AUTUMN_SEASON = new SeasonTile(SeasonTileValue.AUTUMN),
    WINTER_SEASON = new SeasonTile(SeasonTileValue.WINTER),

    GREEN_DRAGON = new DragonTile(DragonTileValue.GREEN),
    WHITE_DRAGON = new DragonTile(DragonTileValue.WHITE),
    RED_DRAGON = new DragonTile(DragonTileValue.RED),

    EAST_WIND = new WindTile(WindTileValue.EAST),
    SOUTH_WIND = new WindTile(WindTileValue.SOUTH),
    WEST_WIND = new WindTile(WindTileValue.WEST),
    NORTH_WIND = new WindTile(WindTileValue.NORTH),

    ONE_BAMBOO = new BambooTile(SuitedTileValue.ONE),
    TWO_BAMBOO = new BambooTile(SuitedTileValue.TWO),
    THREE_BAMBOO = new BambooTile(SuitedTileValue.THREE),
    FOUR_BAMBOO = new BambooTile(SuitedTileValue.FOUR),
    FIVE_BAMBOO = new BambooTile(SuitedTileValue.FIVE),
    SIX_BAMBOO = new BambooTile(SuitedTileValue.SIX),
    SEVEN_BAMBOO = new BambooTile(SuitedTileValue.SEVEN),
    EIGHT_BAMBOO  = new BambooTile(SuitedTileValue.EIGHT),
    NINE_BAMBOO = new BambooTile(SuitedTileValue.NINE),

    ONE_CIRCLE = new CircleTile(SuitedTileValue.ONE),
    TWO_CIRCLE = new CircleTile(SuitedTileValue.TWO),
    THREE_CIRCLE = new CircleTile(SuitedTileValue.THREE),
    FOUR_CIRCLE = new CircleTile(SuitedTileValue.FOUR),
    FIVE_CIRCLE = new CircleTile(SuitedTileValue.FIVE),
    SIX_CIRCLE = new CircleTile(SuitedTileValue.SIX),
    SEVEN_CIRCLE = new CircleTile(SuitedTileValue.SEVEN),
    EIGHT_CIRCLE  = new CircleTile(SuitedTileValue.EIGHT),
    NINE_CIRCLE = new CircleTile(SuitedTileValue.NINE),

    ONE_CHARACTER = new CharacterTile(SuitedTileValue.ONE),
    TWO_CHARACTER = new CharacterTile(SuitedTileValue.TWO),
    THREE_CHARACTER = new CharacterTile(SuitedTileValue.THREE),
    FOUR_CHARACTER = new CharacterTile(SuitedTileValue.FOUR),
    FIVE_CHARACTER = new CharacterTile(SuitedTileValue.FIVE),
    SIX_CHARACTER = new CharacterTile(SuitedTileValue.SIX),
    SEVEN_CHARACTER = new CharacterTile(SuitedTileValue.SEVEN),
    EIGHT_CHARACTER = new CharacterTile(SuitedTileValue.EIGHT),
    NINE_CHARACTER = new CharacterTile(SuitedTileValue.NINE);

export const DRAGON_TILES = [GREEN_DRAGON, WHITE_DRAGON, RED_DRAGON];

export const WIND_TILES = [EAST_WIND, SOUTH_WIND, WEST_WIND, NORTH_WIND];

export const HONOR_TILES = [...DRAGON_TILES, ...WIND_TILES];

export const BAMBOO_TILES = [ONE_BAMBOO, TWO_BAMBOO, THREE_BAMBOO, 
    FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO, 
    SEVEN_BAMBOO, EIGHT_BAMBOO, NINE_BAMBOO];

export const CHARACTER_TILES = [ONE_CHARACTER, TWO_CHARACTER, THREE_CHARACTER, 
    FOUR_CHARACTER, FIVE_CHARACTER, SIX_CHARACTER, 
    SEVEN_CHARACTER, EIGHT_CHARACTER, NINE_CHARACTER];

export const CIRCLE_TILES = [ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE, 
    FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE, 
    SEVEN_CIRCLE, EIGHT_CIRCLE, NINE_CIRCLE];

export const SUITED_TILES = [...BAMBOO_TILES, ...CHARACTER_TILES, ...CIRCLE_TILES];

export const TERMINAL_TILES = [ONE_BAMBOO, NINE_BAMBOO, ONE_CHARACTER, NINE_CHARACTER, ONE_CIRCLE, NINE_CIRCLE];

export const SIMPLE_TILES = [TWO_BAMBOO, THREE_BAMBOO, 
    FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO, 
    SEVEN_BAMBOO, EIGHT_BAMBOO,
    TWO_CHARACTER, THREE_CHARACTER, 
    FOUR_CHARACTER, FIVE_CHARACTER, SIX_CHARACTER, 
    SEVEN_CHARACTER, EIGHT_CHARACTER,
    TWO_CIRCLE, THREE_CIRCLE, 
    FOUR_CIRCLE, FIVE_CIRCLE, SIX_CIRCLE, 
    SEVEN_CIRCLE, EIGHT_CIRCLE
]

export function getSuitedTilesForSuitedTileGroup(stg: SuitedTileGroup) {
    if (stg === TileGroup.BAMBOO) {
        return BAMBOO_TILES;
    }
    if (stg === TileGroup.CHARACTER) {
        return CHARACTER_TILES;
    }
    if (stg === TileGroup.CIRCLE) {
        return CIRCLE_TILES;
    }
    throw new Error(`Unsupported SuitedTileGroup ${stg}`);
}

export const GENTLEMEN_TILES = [PLUM_GENTLEMAN, ORCHID_GENTLEMAN, 
    CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN];

export const SEASON_TILES = [SPRING_SEASON, SUMMER_SEASON, 
    AUTUMN_SEASON, WINTER_SEASON];

export const FLOWER_TILES = [...GENTLEMEN_TILES, ...SEASON_TILES];

export const GREEN_TILES = [TWO_BAMBOO, THREE_BAMBOO, FOUR_BAMBOO, 
    SIX_BAMBOO, EIGHT_BAMBOO, GREEN_DRAGON];

export const REVERSIBLE_TILES = [ONE_CIRCLE, TWO_CIRCLE, THREE_CIRCLE, 
    FOUR_CIRCLE, FIVE_CIRCLE, EIGHT_CIRCLE, NINE_CIRCLE, 
    TWO_BAMBOO, FOUR_BAMBOO, FIVE_BAMBOO, SIX_BAMBOO,
    SIX_BAMBOO, EIGHT_BAMBOO, NINE_BAMBOO, WHITE_DRAGON];