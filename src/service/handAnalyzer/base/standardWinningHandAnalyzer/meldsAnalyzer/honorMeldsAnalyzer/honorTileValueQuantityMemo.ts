import { Hand } from "model/hand/hk/hand";
import { getHonorTileValues, honorTileGroups, HonorTileValue } from "model/tile/group/honorTile";
export class HonorTileValueQuantityMemo {
    private _memo: Map<HonorTileValue, number>;

    constructor(hand: Hand) {
        this._memo = new Map<HonorTileValue, number>();
        for (const tileGroup of honorTileGroups) {
            const tileValueQuantityMap = hand.getQuantitiesForTileGroup(tileGroup);
            const honorTileValues = getHonorTileValues(tileGroup);
            for (const honorTileValue of honorTileValues) {
                this._memo.set(honorTileValue, tileValueQuantityMap.get(honorTileValue) ?? 0);
            }
        }
    }

    getQuantity(htv: HonorTileValue): number {
        return this._memo.get(htv) ?? 0;
    }

    decreaseQuantity(htv: HonorTileValue, amtToDecrease: number): number {
        if (amtToDecrease < 0) {
            throw new Error(`Cannot decrease a negative amount: ${amtToDecrease}`);
        }
        const quantity = this.getQuantity(htv);
        if (quantity < amtToDecrease) {
            throw new Error(`Cannot decrease quantity for ${htv}; its quantity (${quantity}) is less than ${amtToDecrease}.`);
        }
        this._memo.set(htv, quantity - amtToDecrease);
        return quantity - amtToDecrease;
    }
}