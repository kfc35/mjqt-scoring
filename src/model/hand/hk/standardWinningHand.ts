import { Meld } from "model/meld/meld.js";
import { Tile, FlowerTile } from "model/tile/tile.js";

/** A WinningHand is a Hand that has been analyzed for a win condition i.e. processed into melds. */
export class StandardWinningHand {
    melds: Meld[];
    bonusTiles: FlowerTile[];
    // map from faan to "explanation", could be a single meld, multiple melds, individual tiles, whole hand, actions unrelated to your hand

    constructor(melds: Meld[], bonusTiles: FlowerTile[]) {
        // assert each tile is not null
        // must have at least 14 non bonus tiles.
        // each individual mahjong tile can only appear max 4 times.
        // need a function that returns potential winning combinations -- e.g. pong first or chi first
        // if there is a 4 of a tile, it could be a kong OR a pong and a chi
        // it's possible for 3 consecutive pongs to also be 3 identical chi
        // need to also check 7 pairs, any bespoke hands.
        this.melds = melds!;
        this.bonusTiles = bonusTiles!;
    }

    analyzeWinningHandForFaan(analyzer: (winningHand: WinningHand) => void) : this {
        analyzer(this);
        return this;
    }

    // several candidate hand objects? you try to see if hand can be converted into a candidate hand object.
}

