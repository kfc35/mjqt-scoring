import { Meld } from "model/meld/meld";
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

export function meldToFlatTiles(melds: readonly Meld[]) : SuitedOrHonorTile[] {
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

export function meldsAreSubset(melds: readonly Meld[], potentialSubset: readonly Meld[]) : boolean {
    const haystack = [...melds];
    for (const needle of potentialSubset) {
        for (let i = 0; i < haystack.length; i++) {
            if (needle.equals(haystack[i], false)) {
                haystack.splice(i, 1);
                break;
            }
        }
    }
    return melds.length - haystack.length === potentialSubset.length;
}

export function getIndexOfMeld(melds: readonly Meld[], meldToFind: Meld, ignoreExposed: boolean = false) : number | undefined {
    for (const [index, meld] of melds.entries()) {
        if (meld.equals(meldToFind, ignoreExposed)) {
            return index;
        }
    }
    return undefined;
}

export function getIndexOfMeldIgnoreExposed(melds: readonly Meld[], meld: Meld) : number | undefined {
    return getIndexOfMeld(melds, meld, true);
}

export function meldExistsInMelds(melds: readonly Meld[], meldToCheck: Meld, ignoreExposed: boolean = false) : boolean {
    return getIndexOfMeld(melds, meldToCheck, ignoreExposed) !== undefined
}

export function meldExistsInMeldsIgnoreExposed(melds: readonly Meld[], meldToCheck: Meld) : boolean {
    return meldExistsInMelds(melds, meldToCheck, true);
}

export function cartesianProduct(listOfMeldsOne: readonly Meld[][], listOfMeldsTwo: readonly Meld[][]) : Meld[][] {
    if (listOfMeldsOne.length === 0) {
        return [...listOfMeldsTwo]; // might also have length = 0, that is fine.
    }
    if (listOfMeldsTwo.length === 0) {
        return [...listOfMeldsOne];
    }
    const product : Meld[][] = [];
    for (const meldsOne of listOfMeldsOne) {
        for (const meldsTwo of listOfMeldsTwo) {
            product.push([...meldsOne, ...meldsTwo]);
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

export function getMeldAtIndex(melds: readonly Meld[], index: number) : Meld {
    if (index < 0 || index >= melds.length) {
        throw new Error(`index ${index} is out of bounds for melds of length ${melds.length}`);
    }
    const meld = melds[index];
    if (!meld) {
        throw new Error(`meld was undefined in melds at index ${index}`);
    }
    return meld;
}