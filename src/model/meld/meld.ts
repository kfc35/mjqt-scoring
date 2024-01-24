import { SuitedOrHonorTile } from "../tile/tile.js";

export interface Meld {
    getType(): MeldType;
    getTiles(): SuitedOrHonorTile[];
    isExposed(): boolean;
}

export enum MeldType {
    PAIR = 'PAIR',
    CHOW = 'CHOW',
    PONG = 'PONG',
    KONG = 'KONG'
}