export enum TileType {
    GENTLEMEN = 'GENTLEMEN',
    SEASON = 'SEASON',
    DRAGON = 'DRAGON',
    WIND = 'WIND',
    BAMBOO = 'BAMBOO',
    CIRCLE = 'CIRCLE',
    CHARACTER = 'CHARACTER'
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

export type TileValue = GentlemenTileValue | SeasonTileValue | DragonTileValue | WindTileValue | SuitedTileValue;

export abstract class Tile {
    private _value: TileValue;

    constructor(value: TileValue) {
        if (!value) {
            throw new TypeError("value cannot be null.")
        }
        this._value = value;
    }

    abstract getType(): TileType;

    get value(): TileValue {
        return this._value;
    }

    equals(otherTile : Tile) : boolean {
        return this.getType() === otherTile.getType() 
            && this.value === otherTile.value;
    }

    compareTo(otherTile : Tile) : number {
        if (this.getType() === otherTile.getType()) {
            if (this.value === otherTile.value) {
                return 0;
            }
            return this.value < otherTile.value ? -1 : +1
        }
        return this.getType() < otherTile.getType() ? -1 : +1
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

export abstract class SuitedTile extends Tile {
    constructor(value: SuitedTileValue) {
        super(value);
    }

    isOneBefore(otherTile: SuitedTile): boolean {
        return this.getType() === otherTile.getType() && 
            (this.value as SuitedTileValue).valueOf() + 1 === (otherTile.value as SuitedTileValue).valueOf();
    }
}

export class BambooTile extends SuitedTile {
    getType(): TileType.BAMBOO {
        return TileType.BAMBOO;
    }
}

export class CircleTile extends SuitedTile {
    getType(): TileType.CIRCLE {
        return TileType.CIRCLE;
    }
}

export class CharacterTile extends SuitedTile {
    getType(): TileType.CHARACTER {
        return TileType.CHARACTER;
    }
}

export type SuitedOrHonorTile = HonorTile | SuitedTile;

export type SuitedOrHonorTileValue = HonorTileValue | SuitedTileValue;

export const flowerTileTypes: ReadonlySet<TileType> = new Set([TileType.GENTLEMEN, TileType.SEASON]);
export const suitedTileTypes: ReadonlySet<TileType> = new Set([TileType.BAMBOO, TileType.CIRCLE, TileType.CHARACTER]);
export const suitedAndHonorTileTypes: ReadonlySet<TileType> = new Set([TileType.DRAGON, TileType.WIND, 
    ...suitedTileTypes]);

// TODO move this into an HK Scoring evaluator. It doesn't belong here.
/* For certain winning hands (e.g. in HK scoring), a dragon is associated with a suit.*/
export const dragonTileToTileType : ReadonlyMap<DragonTileValue, TileType> = new Map<DragonTileValue, TileType>([
    [DragonTileValue.FAAT, TileType.BAMBOO],
    [DragonTileValue.BAAK, TileType.CIRCLE],
    [DragonTileValue.ZONG, TileType.CHARACTER],
])