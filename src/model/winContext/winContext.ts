/**
 * Additional context surrounding a winning hand that results in points.
 * Information surrounding the last tile being "self drawn" are in the hand itself.
 * This class concerns itself with the more superfluous details.
 */
export class WinContext {
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
            return this;
        }

        mostRecentTileIsLastOfItsKind(mostRecentTileIsLastOfItsKind: boolean) {
            this._mostRecentTileIsLastOfItsKind = mostRecentTileIsLastOfItsKind;
            return this;
        }

        winByLastTileOnWall(winByLastTileOnWall: boolean) {
            this._winByLastTileOnWall = winByLastTileOnWall;
            return this;
        }

        winByLastDiscardOfGame(winByLastDiscardOfGame: boolean) {
            this._winByLastDiscardOfGame = winByLastDiscardOfGame;
            return this;
        }

        winByKongReplacement(winByKongReplacement: boolean) {
            this._winByKongReplacement = winByKongReplacement;
            return this;
        }

        winByFlowerReplacement(winByFlowerReplacement: boolean) {
            this._winByFlowerReplacement = winByFlowerReplacement;
            return this;
        }

        winByKongOnKongReplacement(winByKongOnKongReplacement: boolean) {
            this._winByKongOnKongReplacement = winByKongOnKongReplacement;
            return this;
        }

        winByFlowerOnFlowerReplacement(winByFlowerOnFlowerReplacement: boolean) {
            this._winByFlowerOnFlowerReplacement = winByFlowerOnFlowerReplacement;
            return this;
        }

        winByMixedDoubleReplacement(winByMixedDoubleReplacement: boolean) {
            this._winByMixedDoubleReplacement = winByMixedDoubleReplacement;
            return this;
        }

        winWithInitialHand(winWithInitialHand: boolean) {
            this._winWithInitialHand = winWithInitialHand;
            return this;
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