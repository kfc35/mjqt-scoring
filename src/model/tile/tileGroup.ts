import { getEnumKeys } from "common/enumUtils";

export enum TileGroup {
    GENTLEMAN = 'GENTLEMAN',
    SEASON = 'SEASON',
    DRAGON = 'DRAGON',
    WIND = 'WIND',
    BAMBOO = 'BAMBOO',
    CIRCLE = 'CIRCLE',
    CHARACTER = 'CHARACTER'
}

export const tileGroups : TileGroup[] = 
    getEnumKeys(TileGroup).map(key => TileGroup[key]);
