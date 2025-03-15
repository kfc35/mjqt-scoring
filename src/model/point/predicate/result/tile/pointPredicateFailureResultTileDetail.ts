import { Tile } from "model/tile/tile";

export class PointPredicateFailureResultTileDetail {
    protected _tilesThatPartiallySatisfyPredicate: Tile[][];
    protected _tilesThatFailPredicate: Tile[][];

    // use this when specifying tiles and their quantities that must be in the hand
    // e.g. [[SPRING_SEASON, SUMMER_SEASON, FALL_SEASON, WINTER_SEASON], 
    // [PLUM_GENTLEMAN, ORCHID_GENTLEMAN, CHRYSANTHEMUM_GENTLEMAN, BAMBOO_GENTLEMAN]]
    // means that you are missing ALL four seasons AND gentlemen.
    // The nested list is for user friendly grouping.
    // This field has more certainty over missingAnyOf 
    // Note: if you want to be specify missing melds, use FailureResultMeldDetail instead. 
    protected _tilesThatAreMissingToSatisfyPredicate: Tile[][];

    // use this when specifying "you may be missing one or more tiles from a set of tiles" 
    // the inclusion of these tiles is subject to the specificity of the predicate being enforced
    //  and the user's personal strategy
    // e.g. [[ONE_CIRCLE,..., NINE_CIRCLE], [RED_DRAGON, GREEN_DRAGON, BLUE_DRAGON]]
    // means that you are missing tile(s) from CIRCLE_TILES and DRAGON_TILES.
    // In the future, this could be broken out to something more sophisticated.
    protected _tilesThatAreMissingAnyOfToSatisfyPredicate: Tile[][];

    constructor(tilesThatPartiallySatisfyPredicate: Tile[][],
        tilesThatFailPredicate: Tile[][],
        tilesThatAreMissingToSatisfyPredicate: Tile[][],
        tilesThatAreMissingAnyOfToSatisfyPredicate: Tile[][]
    ) {
        this._tilesThatPartiallySatisfyPredicate = tilesThatPartiallySatisfyPredicate;
        this._tilesThatFailPredicate = tilesThatFailPredicate;
        this._tilesThatAreMissingToSatisfyPredicate = tilesThatAreMissingToSatisfyPredicate;
        this._tilesThatAreMissingAnyOfToSatisfyPredicate = tilesThatAreMissingAnyOfToSatisfyPredicate;
    }

    get tilesThatPartiallySatisfyPredicate(): ReadonlyArray<ReadonlyArray<Tile>> {
        return this._tilesThatPartiallySatisfyPredicate;
    }

    get tilesThatFailPredicate(): ReadonlyArray<ReadonlyArray<Tile>> {
        return this._tilesThatFailPredicate;
    }

    get tilesThatAreMissingToSatisfyPredicate(): ReadonlyArray<ReadonlyArray<Tile>> {
        return this._tilesThatAreMissingToSatisfyPredicate;
    }

    get tilesThatAreMissingAnyOfToSatisfyPredicate(): ReadonlyArray<ReadonlyArray<Tile>> {
        return this._tilesThatAreMissingAnyOfToSatisfyPredicate;
    }

    static Builder = class {
        _tilesThatPartiallySatisfyPredicate: Tile[][] = [];

        _tilesThatFailPredicate: Tile[][] = [];
        
        _tilesThatAreMissingToSatisfyPredicate: Tile[][] = [];

        _tilesThatAreMissingAnyOfToSatisfyPredicate: Tile[][] = [];

        tilesThatPartiallySatisfyPredicate(tilesThatPartiallySatisfyPredicate: Tile[][]) {
            this._tilesThatPartiallySatisfyPredicate = tilesThatPartiallySatisfyPredicate;
            return this;
        }

        tilesThatFailPredicate(tilesThatFailPredicate: Tile[][]) {
            this._tilesThatFailPredicate = tilesThatFailPredicate;
            return this;
        }

        tilesThatAreMissingToSatisfyPredicate(tilesThatAreMissingToSatisfyPredicate: Tile[][]) {
            this._tilesThatAreMissingToSatisfyPredicate = tilesThatAreMissingToSatisfyPredicate;
            return this;
        }

        tilesThatAreMissingAnyOfToSatisfyPredicate(tilesThatAreMissingAnyOfToSatisfyPredicate: Tile[][]) {
            this._tilesThatAreMissingAnyOfToSatisfyPredicate = tilesThatAreMissingAnyOfToSatisfyPredicate;
            return this;
        }
    
        build(): PointPredicateFailureResultTileDetail {
            const tileDetail = new PointPredicateFailureResultTileDetail(
                this._tilesThatPartiallySatisfyPredicate,
                this._tilesThatFailPredicate,
                this._tilesThatAreMissingToSatisfyPredicate,
                this._tilesThatAreMissingAnyOfToSatisfyPredicate
            );
            return tileDetail;
        }
    }
}