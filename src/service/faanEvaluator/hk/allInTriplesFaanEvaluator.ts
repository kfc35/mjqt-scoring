import { FaanEvaluator, FaanResult } from "../faanEvaluator.js";
import { Hand } from "../../../model/hand/hand.js";


export class AllPongsFaanEvalulator implements FaanEvaluator {
    private faan = 3;
    private baseFaan = true;

    getFaan(): number {
        return this.faan;
    }

    isBaseFaan(): boolean {
        return this.baseFaan;
    }

    evaluate(hand: Hand) {
        hand.tiles;
        return new FaanResult(false, this.getFaan(), this.isBaseFaan());
    }
}