import Meld from "model/meld/meld";
import { MeldType } from "model/meld/meldType";

export function meldsNotNullAndCorrectLength(melds: Meld[], length: number): boolean {
    return (melds && melds.every(meld => !!meld) && melds.length === length);
}

export function meldsHasOnePair(melds: Meld[]): boolean {
    const pairs = melds.filter(meld => meld.type === MeldType.PAIR);
    return pairs.length === 1;
}

export function meldsNumKongs(melds: Meld[]): number {
    const kongs = melds.filter(meld => meld.type === MeldType.KONG);
    return kongs.length;
}

export function meldsNumTiles(melds: Meld[]) : number {
    return melds.map(meld => meld.tiles.length).reduce<number>((sum, len) => sum + len, 0);
}