import { WinContextBuilder } from "model/winContext/winContext";

describe('winContext.ts Builder', () => {
    test('mostRecentTileIsLastOfItsKind is set correctly', () => {
        const winContext = new WinContextBuilder().mostRecentTileIsLastOfItsKind(true).build();

        expect(winContext.mostRecentTileIsLastOfItsKind).toBe(true);
    });

    test('winByRobbingAKong is set correctly', () => {
        const winContext = new WinContextBuilder().winByRobbingAKong(true).build();

        expect(winContext.winByRobbingAKong).toBe(true);
    });

    test('winByLastTileOnWall is set correctly', () => {
        const winContext = new WinContextBuilder().winByLastTileOnWall(true).build();

        expect(winContext.winByLastTileOnWall).toBe(true);
    });

    test('winByLastDiscardOfGame is set correctly', () => {
        const winContext = new WinContextBuilder().winByLastDiscardOfGame(true).build();

        expect(winContext.winByLastDiscardOfGame).toBe(true);
    });

    test('winByKongReplacement is set correctly', () => {
        const winContext = new WinContextBuilder().winByKongReplacement(true).build();

        expect(winContext.winByKongReplacement).toBe(true);
    });

    test('winByFlowerReplacement is set correctly', () => {
        const winContext = new WinContextBuilder().winByFlowerReplacement(true).build();

        expect(winContext.winByFlowerReplacement).toBe(true);
    });

    test('winByKongOnKongReplacement is set correctly', () => {
        const winContext = new WinContextBuilder().winByKongOnKongReplacement(true).build();

        expect(winContext.winByKongOnKongReplacement).toBe(true);
    });

    test('winByFlowerOnFlowerReplacement is set correctly', () => {
        const winContext = new WinContextBuilder().winByFlowerOnFlowerReplacement(true).build();

        expect(winContext.winByFlowerOnFlowerReplacement).toBe(true);
    });

    test('winByMixedDoubleReplacement is set correctly', () => {
        const winContext = new WinContextBuilder().winByMixedDoubleReplacement(true).build();

        expect(winContext.winByMixedDoubleReplacement).toBe(true);
    });

    test('winWithInitialHand is set correctly', () => {
        const winContext = new WinContextBuilder().winWithInitialHand(true).build();

        expect(winContext.winWithInitialHand).toBe(true);
    });

    test('copies mostRecentTileIsLastOfItsKind correctly from existing win context', () => {
        const winContext = new WinContextBuilder().mostRecentTileIsLastOfItsKind(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.mostRecentTileIsLastOfItsKind).toBe(true);
    });

    test('copies winByRobbingAKong correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winByRobbingAKong(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winByRobbingAKong).toBe(true);
    });

    test('copies winByLastTileOnWall correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winByLastTileOnWall(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winByLastTileOnWall).toBe(true);
    });

    test('copies winByLastDiscardOfGame correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winByLastDiscardOfGame(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winByLastDiscardOfGame).toBe(true);
    });

    test('copies winByKongReplacement correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winByKongReplacement(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winByKongReplacement).toBe(true);
    });

    test('copies winByFlowerReplacement correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winByFlowerReplacement(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winByFlowerReplacement).toBe(true);
    });

    test('copies winByKongOnKongReplacement correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winByKongOnKongReplacement(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winByKongOnKongReplacement).toBe(true);
    });

    test('copies winByFlowerOnFlowerReplacement correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winByFlowerOnFlowerReplacement(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winByFlowerOnFlowerReplacement).toBe(true);
    });

    test('copies winByMixedDoubleReplacement correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winByMixedDoubleReplacement(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winByMixedDoubleReplacement).toBe(true);
    });

    test('copies winWithInitialHand correctly from existing win context', () => {
        const winContext = new WinContextBuilder().winWithInitialHand(true).build();
        const winContextToTest = new WinContextBuilder().copyFrom(winContext).build();

        expect(winContextToTest.winWithInitialHand).toBe(true);
    });
});
