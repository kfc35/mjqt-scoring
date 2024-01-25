import { SuitedOrHonorTile } from "model/tile/tile.js";

export const meldMinLength = 2;
export const meldMaxLength = 4;

export abstract class Meld {
    private _tiles: SuitedOrHonorTile[];
    private _exposed: boolean;

    constructor(tiles: SuitedOrHonorTile[], exposed?: boolean) {
        this._tiles = tiles;
        this._exposed = (exposed ? exposed : false);
    }

    abstract getType(): MeldType;

    get tiles(): SuitedOrHonorTile[] {
        return this._tiles;
    }

    get exposed(): boolean {
        return this._exposed;
    }
}

export enum MeldType {
    PAIR = 'PAIR',
    CHOW = 'CHOW',
    PONG = 'PONG',
    KONG = 'KONG'
}