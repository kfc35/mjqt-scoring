"use strict";

import { Hand } from "./hand.js";

interface Faan {
    evaluate(hand: Hand) : number;
}