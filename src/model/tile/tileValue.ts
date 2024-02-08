function getEnumKeys<T extends object, K = keyof T>(tileValueEnum: T): K[] {
    return Object.keys(tileValueEnum).filter(k => isNaN(Number(k))) as K[];
}

export enum GentlemanTileValue {
    PLUM = 'PLUM',
    ORCHID = 'ORCHID',
    BAMBOO = 'BAMBOO',
    CHRYSANTHEMUM = 'CHRYSANTHEMUM'
}

// Should automatically be sorted by declaration order.
export const gentlemanTileValues : GentlemanTileValue[] = 
    getEnumKeys(GentlemanTileValue).map(key => GentlemanTileValue[key]);

export enum SeasonTileValue {
    SPRING = 'SPRING',
    SUMMER = 'SUMMER',
    AUTUMN = 'AUTUMN',
    WINTER = 'WINTER'
}

export const seasonTileValues : SeasonTileValue[] = 
    getEnumKeys(SeasonTileValue).map(key => SeasonTileValue[key]);


export enum DragonTileValue {
    FAAT = 'FAAT',
    BAAK = 'CIRCLE',
    ZONG = 'CHARACTER'
}

export const dragonTileValues : DragonTileValue[] = 
    getEnumKeys(DragonTileValue).map(key => DragonTileValue[key]);

export enum WindTileValue {
    EAST = 'EAST',
    SOUTH = 'SOUTH',
    WEST = 'WEST',
    NORTH = 'NORTH'
}

export const windTileValues : WindTileValue[] = 
    getEnumKeys(WindTileValue).map(key => WindTileValue[key]);

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

export const suitedTileValues : SuitedTileValue[] = 
    getEnumKeys(SuitedTileValue).map(key => SuitedTileValue[key])
    .sort((v1, v2) => v1.valueOf() - v2.valueOf()); // just in case, sort explicitly by value.

export function getNextTileValue(suitedTileValue : SuitedTileValue) : SuitedTileValue | undefined {
    if (suitedTileValue < SuitedTileValue.NINE && suitedTileValue >= SuitedTileValue.ONE) {
        return suitedTileValue + 1;
    }
    if (suitedTileValue === SuitedTileValue.NINE) {
        return undefined;
    }
    throw new Error("Unhandled SuitedTileValue.");
}

export type TileValue = GentlemanTileValue | SeasonTileValue | DragonTileValue | WindTileValue | SuitedTileValue;