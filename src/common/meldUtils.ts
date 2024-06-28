import Meld from "model/meld/meld";
import { Tile } from "model/tile/tile";
import { SuitedOrHonorTile } from "model/tile/group/suitedOrHonorTile";
import { meldIsPair } from "model/meld/pair";
import { meldIsKong } from "model/meld/kong";

export function meldsNotNullAndCorrectLength(melds: readonly Meld[], length: number): boolean {
    return (melds && melds.every(meld => !!meld) && melds.length === length);
}

export function meldsHasOnePair(melds: readonly Meld[]): boolean {
    const pairs = melds.filter(meld => meldIsPair(meld));
    return pairs.length === 1;
}

export function meldsNumKongs(melds: readonly Meld[]): number {
    const kongs = melds.filter(meld => meldIsKong(meld));
    return kongs.length;
}

export function meldsNumTiles(melds: readonly Meld[]) : number {
    return melds.map(meld => meld.tiles.length).reduce<number>((sum, len) => sum + len, 0);
}

export function toTiles(melds: readonly Meld[]) : SuitedOrHonorTile[][] {
    return melds.map(meld => meld.tiles);
}

export function toFlatTiles(melds: readonly Meld[]) : SuitedOrHonorTile[] {
    return melds.map(meld => meld.tiles)
        .reduce<SuitedOrHonorTile[]>((accum, tiles) => accum.concat(tiles), []);
}

export function meldHasTile(meld: Meld, tile: Tile) : boolean {
    for (const meldTile of meld.tiles) {
        if (meldTile.equals(tile)) {
            return true;
        }
    }
    return false;
}

export function meldsAreSubset(melds: readonly Meld[], potentialSubset: readonly Meld[], ignoreExposed? : boolean) : boolean {
    const haystack = [...melds];
    for (const needle of potentialSubset) {
        let found = false;
        for (let i = 0; i < haystack.length; i++) {
            if (needle.equals(haystack[i], ignoreExposed)) {
                haystack.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}

export function meldsIntersection(meldsOne: readonly Meld[], meldsTwo: readonly Meld[], ignoreExposed? : boolean) : Meld[] {
    const intersection = [];
    const meldsTwoCopy = [...meldsTwo];
    for (const meldOne of meldsOne) {
        for (let i = 0; i < meldsTwoCopy.length; i++) {
            if (meldOne.equals(meldsTwoCopy[i], ignoreExposed)) {
                intersection.push(meldOne.clone());
                meldsTwoCopy.splice(i, 1)
                break;
            }
        }
    }
    return intersection;
}

export function getIndexOfMeld(melds: readonly Meld[], meldToFind: Meld, ignoreExposed: boolean = false) : number {
    for (const [index, meld] of melds.entries()) {
        if (meld.equals(meldToFind, ignoreExposed)) {
            return index;
        }
    }
    return -1;
}

export function getIndexOfMeldIgnoreExposed(melds: readonly Meld[], meld: Meld) : number {
    return getIndexOfMeld(melds, meld, true);
}

export function meldExistsInMelds(melds: readonly Meld[], meldToCheck: Meld, ignoreExposed: boolean = false) : boolean {
    return getIndexOfMeld(melds, meldToCheck, ignoreExposed) !== -1
}

export function meldExistsInMeldsIgnoreExposed(melds: readonly Meld[], meldToCheck: Meld) : boolean {
    return meldExistsInMelds(melds, meldToCheck, true);
}

export function cartesianProduct(meldsOne: readonly Meld[][], meldsTwo: readonly Meld[][]) : readonly Meld[][] {
    if (meldsOne.length === 0) {
        return meldsTwo; // might also have length = 0, that is fine.
    }
    if (meldsTwo.length === 0) {
        return meldsOne;
    }
    const product : Meld[][] = [];
    for (const meldOne of meldsOne) {
        for (const meldTwo of meldsTwo) {
            product.push([...meldOne, ...meldTwo]);
        }
    }
    return product;
}

export function getMeldsSubsetFromIndicesSet(melds: readonly Meld[], indices: ReadonlySet<number>): Meld[] {
    return melds.filter((_meld, index) => indices.has(index));
}

export function getAllIndicesSet(melds: readonly Meld[]): Set<number> {
    return new Set(melds.map((_meld, index) => index));
}