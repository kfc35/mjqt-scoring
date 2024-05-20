import Meld from "model/meld/meld";
import { TileGroup } from "model/tile/tileGroup";

export function groupMeldsByTileGroupSatisfyingCondition(melds: readonly Meld[], meldCondition: (meld: Meld) => boolean) : ReadonlyMap<TileGroup, Meld[]> {
    const tileGroupToMelds: Map<TileGroup, Meld[]> = new Map();
    melds.filter(meld => meldCondition(meld))
        .map(meld => [meld.getTileGroupOfFirstTile(), meld] as [TileGroup, Meld])
        .forEach(([tileGroup, meld]) => {
            const tileGroupMelds = tileGroupToMelds.get(tileGroup);
            if (tileGroupMelds) {
                tileGroupMelds.push(meld)
            } else {
                tileGroupToMelds.set(tileGroup, [meld])
            }
        });
    return tileGroupToMelds;
}