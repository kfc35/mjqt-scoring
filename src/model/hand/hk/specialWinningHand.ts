import { Tile, FlowerTile } from "model/tile/tile.js";
import Pair from "model/meld/pair";
import { HongKongTile } from "model/tile/hk/hongKongTile";

/** A SpecialWinningHand has a combination of tiles that does not fit the "meld" structure. */
export class SpecialWinningHand {
    tiles: SuitedOrHonorTile[];
    pair?: Pair;
    bonusTiles: FlowerTile[];

    constructor(hand: Hand) {
        // assert each tile is not null
        // must have at least 14 non bonus tiles.
        // each individual mahjong tile can only appear max 4 times.
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands.
    }

    analyzeWinningHandForFaan(analyzer: (winningHand: WinningHand) => void) : this {
        analyzer(this);
        return this;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
}