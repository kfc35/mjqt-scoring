export class WinContext {
    isSelfDraw: boolean;
    mostRecentTileIsLastOfItsKind: boolean;
    robbedAKong: boolean;
    winByLastTileOnWall: boolean;
    winByLastDiscardOfGame: boolean;

    constructor(isSelfDraw: boolean, 
        mostRecentTileIsLastOfItsKind: boolean,
        robbedAKong: boolean,
        winByLastTileOnWall: boolean,
        winByLastDiscardOfGame: boolean) {
        this.isSelfDraw = isSelfDraw;
        this.mostRecentTileIsLastOfItsKind = mostRecentTileIsLastOfItsKind;
        this.robbedAKong = robbedAKong;
        this.winByLastTileOnWall = winByLastTileOnWall;
        this.winByLastDiscardOfGame = winByLastDiscardOfGame;
    }

    static Builder = class {
        _isSelfDraw: boolean = false;
        _robbedAKong: boolean = false;
        _mostRecentTileIsLastOfItsKind: boolean = false;
        _winByLastTileOnWall: boolean = false;
        _winByLastDiscardOfGame: boolean = false;

        isSelfDraw(isSelfDraw: boolean) {
            this._isSelfDraw = isSelfDraw;
        }

        robbedAKong(robbedAKong: boolean) {
            this._robbedAKong = robbedAKong;
        }

        mostRecentTileIsLastOfItsKind(mostRecentTileIsLastOfItsKind: boolean) {
            this._mostRecentTileIsLastOfItsKind = mostRecentTileIsLastOfItsKind;
        }

        winByLastTileOnWall(winByLastTileOnWall: boolean) {
            this._winByLastTileOnWall = winByLastTileOnWall;
        }

        winByLastDiscardOfGame(winByLastDiscardOfGame: boolean) {
            this._winByLastDiscardOfGame = winByLastDiscardOfGame;
        }

        build() {
            const winContext = new WinContext(this._isSelfDraw, this._mostRecentTileIsLastOfItsKind, 
                this._robbedAKong, 
                this._winByLastTileOnWall, this._winByLastDiscardOfGame);
            return winContext;
        }
    }

    SELF_DRAW = 'SELF_DRAW', // last tile is NOT a discard
    // "Win By Wall" aka "Concealed Hand" is calculated by looking at the melds.
    ROBBING_KONG = 'ROBBING_KONG',  // a special type of discard win - eating someones discard that would have been someone else's kong
    WIN_BY_LAST_TILE = 'WIN_BY_LAST_TILE', // win by last tile on wall
    WIN_BY_LAST_DISCARD = 'WIN_BY_LAST_DISCARD', // win by last discard of game
    WIN_BY_KONG = 'WIN_BY_KONG', // win via replacement tile from kong
    WIN_BY_FLOWER = 'WIN_BY_FLOWER', // win via replacement tile from flower
    WIN_BY_DOUBLE_KONG = 'WIN_BY_DOUBLE_KONG', // win via replacement tile of replacement tile
    WIN_BY_DOUBLE_FLOWER = 'WIN_BY_DOUBLE_FLOWER', // win via replacement tile after drawing two flowers in a row
    WIN_WITH_INITIAL_HAND = 'WIN_WITH_INITIAL_HAND' // can be HEAVENLY_HAND or EARTHLY_HAND depending on the RoundContext.
}