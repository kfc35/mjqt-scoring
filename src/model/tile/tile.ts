export enum TileType {
    GENTLEMEN = 'GENTLEMEN',
    SEASON = 'SEASON',
    DRAGON = 'DRAGON',
    WIND = 'WIND',
    BAMBOO = 'BAMBOO',
    CIRCLE = 'CIRCLE',
    CHARACTER = 'CHARACTER'
}

export enum SuitedTileValue {
    ONE = 1, 
    TWO, 
    THREE, 
    FOUR, 
    FIVE, 
    SIX, 
    SEVEN, 
    EIGHT, 
    NINE
}

export enum GentlemenTileValue {
    PLUM = 'PLUM',
    ORCHID = 'ORCHID',
    BAMBOO = 'BAMBOO',
    CHRYSANTHEMUM = 'CHRYSANTHEMUM'
}

export enum SeasonTileValue {
    SPRING = 'SPRING',
    SUMMER = 'SUMMER',
    AUTUMN = 'AUTUMN',
    WINTER = 'WINTER'
}

export enum DragonTileValue {
    FAAT = 'FAAT',
    BAAK = 'CIRCLE',
    ZONG = 'CHARACTER'
}

export enum WindTileValue {
    EAST = 'EAST',
    SOUTH = 'SOUTH',
    WEST = 'WEST',
    NORTH = 'NORTH'
}

type TileValue = SuitedTileValue | WindTileValue | GentlemenTileValue | SeasonTileValue | DragonTileValue;

abstract class Tile {
    private _value: TileValue;

    constructor(value: TileValue) {
        this._value = value!;
    }

    abstract getType(): TileType;

    get value(): TileValue {
        return this._value;
    }
}

export class GentlemenTile extends Tile {
    constructor(value: GentlemenTileValue) {
        super(value);
    }

    getType(): TileType.GENTLEMEN {
        return TileType.GENTLEMEN;
    }
}

export class SeasonTile extends Tile {
    constructor(value: SeasonTileValue) {
        super(value);
    }

    getType(): TileType.SEASON {
        return TileType.SEASON;
    }
}

export type FlowerTile = GentlemenTile | SeasonTile;
export type FlowerTileValue = GentlemenTileValue | SeasonTileValue;

export class DragonTile extends Tile {
    constructor(value: DragonTileValue) {
        super(value);
    }

    getType(): TileType.DRAGON {
        return TileType.DRAGON;
    }
}

export class WindTile extends Tile {
    constructor(value: WindTileValue) {
        super(value);
    }

    getType(): TileType.WIND {
        return TileType.WIND;
    }
}

export type HonorTile = DragonTile | WindTile;
export type HonorTileValue = DragonTileValue | WindTileValue;

export class BambooTile extends Tile {
    constructor(value: SuitedTileValue) {
        super(value);
    }

    getType(): TileType.BAMBOO {
        return TileType.BAMBOO;
    }
}

export class CircleTile extends Tile {
    constructor(value: SuitedTileValue) {
        super(value);
    }

    getType(): TileType.CIRCLE {
        return TileType.CIRCLE;
    }
}

export class CharacterTile extends Tile {
    constructor(value: SuitedTileValue) {
        super(value);
    }

    getType(): TileType.CHARACTER {
        return TileType.CHARACTER;
    }
}

export type SuitedTile = BambooTile | CircleTile | CharacterTile;

export type SuitedOrHonorTile = HonorTile | SuitedTile;

export type SuitedOrHonorTileValue = HonorTileValue | SuitedTileValue;

export type MahjongTile = SuitedOrHonorTile | FlowerTile;

// TODO move this into an HK Scoring evaluator. It doesn't belong here.
/* For certain winning hands (e.g. in HK scoring), a dragon is associated with a suit.*/
export const dragonTileToTileType : ReadonlyMap<DragonTileValue, TileType> = new Map<DragonTileValue, TileType>([
    [DragonTileValue.FAAT, TileType.BAMBOO],
    [DragonTileValue.BAAK, TileType.CIRCLE],
    [DragonTileValue.ZONG, TileType.CHARACTER],
])