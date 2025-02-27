import { Hand } from "model/hand/hk/hand";
import { getHonorTileValues, honorTileGroups, HonorTileValue } from "model/tile/group/honorTile";
export class HonorTileValueQuantityMemo {
    private _memo: Map<HonorTileValue, number>;

    constructor(hand: Hand);
    constructor(toBeCopied: HonorTileValueQuantityMemo); 
    constructor(handOrToBeCopied: Hand | HonorTileValueQuantityMemo) {
        if (handOrToBeCopied instanceof Hand) {
            this._memo = new Map<HonorTileValue, number>();
            for (const tileGroup of honorTileGroups) {
                const tileValueQuantityMap = handOrToBeCopied.getQuantitiesForTileGroup(tileGroup);
                const honorTileValues = getHonorTileValues(tileGroup);
                for (const honorTileValue of honorTileValues) {
                    this._memo.set(honorTileValue, tileValueQuantityMap.get(honorTileValue) ?? 0);
                }
            }
        } else {
            this._memo = handOrToBeCopied._memo;
            for (const [key, value] of handOrToBeCopied.memo.entries()) {
                this._memo.set(key, value);
            }
        }
    }

    getQuantity(htv: HonorTileValue): number {
        const quantity = this._memo.get(htv)
        if (!quantity) {
            throw new Error(`Memo has undefined value for HonorTileValue ${htv}.`);
        }
        return quantity;
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

    private get memo(): Map<HonorTileValue, number> {
        return this._memo;
    }
}