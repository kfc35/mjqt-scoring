import { WinContext } from "model/winContext/winContext";

describe('winContext.ts Builder', () => {
    test('mostRecentTileIsLastOfItsKind is set correctly', () => {
        const winContext = new WinContext.Builder().mostRecentTileIsLastOfItsKind(true).build();

        expect(winContext.mostRecentTileIsLastOfItsKind).toBe(true);
    });

    test('winByRobbingAKong is set correctly', () => {
        const winContext = new WinContext.Builder().winByRobbingAKong(true).build();

        expect(winContext.winByRobbingAKong).toBe(true);
    });

    test('winByLastTileOnWall is set correctly', () => {
        const winContext = new WinContext.Builder().winByLastTileOnWall(true).build();

        expect(winContext.winByLastTileOnWall).toBe(true);
    });

    test('winByLastDiscardOfGame is set correctly', () => {
        const winContext = new WinContext.Builder().winByLastDiscardOfGame(true).build();

        expect(winContext.winByLastDiscardOfGame).toBe(true);
    });

    test('winByKongReplacement is set correctly', () => {
        const winContext = new WinContext.Builder().winByKongReplacement(true).build();

        expect(winContext.winByKongReplacement).toBe(true);
    });

    test('winByFlowerReplacement is set correctly', () => {
        const winContext = new WinContext.Builder().winByFlowerReplacement(true).build();

        expect(winContext.winByFlowerReplacement).toBe(true);
    });

    test('winByKongOnKongReplacement is set correctly', () => {
        const winContext = new WinContext.Builder().winByKongOnKongReplacement(true).build();

        expect(winContext.winByKongOnKongReplacement).toBe(true);
    });

    test('winByFlowerOnFlowerReplacement is set correctly', () => {
        const winContext = new WinContext.Builder().winByFlowerOnFlowerReplacement(true).build();

        expect(winContext.winByFlowerOnFlowerReplacement).toBe(true);
    });

    test('winByMixedDoubleReplacement is set correctly', () => {
        const winContext = new WinContext.Builder().winByMixedDoubleReplacement(true).build();

        expect(winContext.winByMixedDoubleReplacement).toBe(true);
    });

    test('winWithInitialHand is set correctly', () => {
        const winContext = new WinContext.Builder().winWithInitialHand(true).build();

        expect(winContext.winWithInitialHand).toBe(true);
    });
});
