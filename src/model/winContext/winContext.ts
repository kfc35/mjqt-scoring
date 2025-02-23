/**
 * Additional context surrounding a winning hand that results in points.
 * Information surrounding the last tile being "self drawn" are in the hand itself.
 * This class concerns itself with the more superfluous details.
 */
export default class WinContext {
    mostRecentTileIsLastOfItsKind: boolean; // cannot be inferred from tilehog alone.
    winByRobbingAKong: boolean;
    winByLastTileOnWall: boolean;
    winByLastDiscardOfGame: boolean;
    winByKongReplacement: boolean;
    winByFlowerReplacement: boolean;
    winByKongOnKongReplacement: boolean;
    winByFlowerOnFlowerReplacement: boolean;
    winByMixedDoubleReplacement: boolean; // flower -> kong -> win or kong -> flower -> win
    winWithInitialHand: boolean;

    constructor(mostRecentTileIsLastOfItsKind: boolean,
        winByRobbingAKong: boolean,
        winByLastTileOnWall: boolean,
        winByLastDiscardOfGame: boolean,
        winByKongReplacement: boolean,
        winByFlowerReplacement: boolean,
        winByKongOnKongReplacement: boolean,
        winByFlowerOnFlowerReplacement: boolean,
        winByMixedDoubleReplacement: boolean,
        winWithInitialHand: boolean) {
        this.mostRecentTileIsLastOfItsKind = mostRecentTileIsLastOfItsKind;
        this.winByRobbingAKong = winByRobbingAKong;
        this.winByLastTileOnWall = winByLastTileOnWall;
        this.winByLastDiscardOfGame = winByLastDiscardOfGame;
        this.winByKongReplacement = winByKongReplacement;
        this.winByFlowerReplacement = winByFlowerReplacement;
        this.winByKongOnKongReplacement = winByKongOnKongReplacement;
        this.winByFlowerOnFlowerReplacement = winByFlowerOnFlowerReplacement;
        this.winByMixedDoubleReplacement = winByMixedDoubleReplacement;
        this.winWithInitialHand = winWithInitialHand;
    }

    static Builder = class {
        _winByRobbingAKong: boolean = false;
        _mostRecentTileIsLastOfItsKind: boolean = false;
        _winByLastTileOnWall: boolean = false;
        _winByLastDiscardOfGame: boolean = false;
        _winByKongReplacement: boolean = false;
        _winByFlowerReplacement: boolean = false;
        _winByKongOnKongReplacement: boolean = false;
        _winByFlowerOnFlowerReplacement: boolean = false;
        _winByMixedDoubleReplacement: boolean = false;
        _winWithInitialHand: boolean = false;

        winByRobbingAKong(winByRobbingAKong: boolean) {
            this._winByRobbingAKong = winByRobbingAKong;
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

        winByKongReplacement(winByKongReplacement: boolean) {
            this._winByKongReplacement = winByKongReplacement;
        }

        winByFlowerReplacement(winByFlowerReplacement: boolean) {
            this._winByFlowerReplacement = winByFlowerReplacement;
        }

        winByKongOnKongReplacement(winByKongOnKongReplacement: boolean) {
            this._winByKongOnKongReplacement = winByKongOnKongReplacement;
        }

        winByFlowerOnFlowerReplacement(winByFlowerOnFlowerReplacement: boolean) {
            this._winByFlowerOnFlowerReplacement = winByFlowerOnFlowerReplacement;
        }

        winByMixedDoubleReplacement(winByMixedDoubleReplacement: boolean) {
            this._winByMixedDoubleReplacement = winByMixedDoubleReplacement;
        }

        winWithInitialHand(winWithInitialHand: boolean) {
            this._winWithInitialHand = winWithInitialHand;
        }

        build() {
            const winContext = new WinContext(
                this._mostRecentTileIsLastOfItsKind, this._winByRobbingAKong, 
                this._winByLastTileOnWall, this._winByLastDiscardOfGame,
                this._winByKongReplacement, this._winByFlowerReplacement,
                this._winByKongOnKongReplacement, this._winByFlowerOnFlowerReplacement,
                this._winByMixedDoubleReplacement, this._winWithInitialHand);
            return winContext;
        }
    }
}