import { Hand } from "../../model/hand/hand.js";

export interface FaanEvaluator {
    getFaan(): number;
    isBaseFaan(): boolean;
    evaluate(hand: Hand) : FaanResult;
}

export class FaanResult {
    private awardFaan: boolean;
    private faan: number;
    private baseFaan: boolean;
    // TODO need to redesign this to not be circular...
    private overrideEvaluators: Set<FaanEvaluator>;

    constructor(awardFaan: boolean, faan: number, baseFaan: boolean, overrideEvaluators?: Set<FaanEvaluator>) {
        this.awardFaan = awardFaan;
        this.faan = faan;
        this.baseFaan = baseFaan;
        this.overrideEvaluators = (overrideEvaluators ? overrideEvaluators : new Set<FaanEvaluator>());
    }

    shouldAwardFaan(): boolean {
        return this.awardFaan;
    }

    getFaan(): number {
        return this.faan;
    }

    isBaseFaan(): boolean {
        return this.baseFaan;
    }

    getOverrideEvaluators(): Set<FaanEvaluator> {
        return this.overrideEvaluators;
    }
}