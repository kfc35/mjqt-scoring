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

/* For certain winning hands (e.g. in HK scoring), a dragon is associated with a suit.*/
export const dragonTileToTileType : ReadonlyMap<DragonTileValue, TileType> = new Map<DragonTileValue, TileType>([
    [DragonTileValue.FAAT, TileType.BAMBOO],
    [DragonTileValue.BAAK, TileType.CIRCLE],
    [DragonTileValue.ZONG, TileType.CHARACTER],
])

type TileValue = SuitedTileValue | WindTileValue | GentlemenTileValue | SeasonTileValue | DragonTileValue;

 interface Tile {
    getType(): TileType;
    getValue(): TileValue;
}

export class GentlemenTile implements Tile {
    private tileType: TileType = TileType.GENTLEMEN;
    private value: GentlemenTileValue;

    constructor(value: GentlemenTileValue) {
        this.value = value!;
    }

    getType(): TileType {
        return this.tileType;
    }

    getValue(): GentlemenTileValue {
        return this.value;
    }
}

export class SeasonTile implements Tile {
    private tileType: TileType = TileType.SEASON;
    private value: SeasonTileValue;

    constructor(value: SeasonTileValue) {
        this.value = value!;
    }

    getType(): TileType {
        return this.tileType;
    }

    getValue(): SeasonTileValue {
        return this.value;
    }
}

export type FlowerTile = GentlemenTile | SeasonTile;

export class DragonTile implements Tile {
    private tileType: TileType = TileType.DRAGON;
    private value: DragonTileValue;

    constructor(value: DragonTileValue) {
        this.value = value!;
    }

    getType(): TileType {
        return this.tileType;
    }

    getValue(): DragonTileValue {
        return this.value;
    }
}

export class WindTile implements Tile {
    private tileType: TileType = TileType.WIND;
    private value: WindTileValue;

    constructor(value: WindTileValue) {
        this.value = value!;
    }

    getType(): TileType {
        return this.tileType;
    }

    getValue(): WindTileValue {
        return this.value;
    }
}

export type HonorTile = DragonTile | WindTile;

export type HonorTileValue = DragonTileValue | WindTileValue;

export class BambooTile implements Tile {
    private tileType: TileType = TileType.BAMBOO;
    private value: SuitedTileValue;

    constructor(value: SuitedTileValue) {
        this.value = value!;
    }

    getType(): TileType {
        return this.tileType;
    }

    getValue(): SuitedTileValue {
        return this.value;
    }
}

export class CircleTile implements Tile {
    private tileType: TileType = TileType.CIRCLE;
    private value!: SuitedTileValue;

    constructor(value: SuitedTileValue) {
        this.value = value!;
    }

    getType(): TileType {
        return this.tileType;
    }

    getValue(): SuitedTileValue {
        return this.value;
    }
}

export class CharacterTile implements Tile {
    private tileType: TileType = TileType.CHARACTER;
    private value: SuitedTileValue;

    constructor(value: SuitedTileValue) {
        this.value = value!;
    }

    getType(): TileType {
        return this.tileType;
    }

    getValue(): SuitedTileValue {
        return this.value;
    }
}

export type SuitedTile = BambooTile | CircleTile | CharacterTile;

export type SuitedOrHonorTile = HonorTile | SuitedTile;

export type SuitedOrHonorTileValue = HonorTileValue | SuitedTileValue;

export type MahjongTile = SuitedOrHonorTile | FlowerTile;  