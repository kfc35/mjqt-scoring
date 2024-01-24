"use strict";

import { Hand } from "./hand.js";

interface FaanEvaluator {
    getFaan(): number;
    isBaseFaan(): boolean;
    evaluate(hand: Hand) : FaanResult;
}

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

export class FaanResult {
    private awardFaan: boolean;
    private faan: number;
    private baseFaan: boolean;
    private overrideEvaluators: Set<FaanEvaluator>;

    constructor(awardFaan: boolean, faan: number, baseFaan: boolean, overrideEvaluators?: Set<FaanEvaluator>) {
        this.awardFaan = awardFaan;
        this.faan = faan;
        this.baseFaan = baseFaan;
        this.overrideEvaluators = (overrideEvaluators ? overrideEvaluators : new Set<FaanEvaluator>();
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