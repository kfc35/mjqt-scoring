import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import createFlowerPointPredicateWiring from "service/point/predicate/wiring/hk/flowerPointPredicateWiring";
import createHandPointPredicateWiring from "service/point/predicate/wiring/hk/handPointPredicateWiring";
import createMeldBasedPointPredicateWiring from "service/point/predicate/wiring/hk/meldBasedPointPredicateWiring";
import createTileBasedPointPredicateWiring from "service/point/predicate/wiring/hk/tileBasedPointPredicateWiring";
import createWinConditionPointPredicateWiring from "service/point/predicate/wiring/hk/winConditionPointPredicateWiring";

export const pointPredicateWiring : Map<PointPredicateID, PointPredicate<WinningHand>> = createPointPredicateBaseWiring();

function createPointPredicateBaseWiring(): Map<PointPredicateID, PointPredicate<WinningHand>> {
    const pointPredicateWiring : Map<PointPredicateID, PointPredicate<WinningHand>> = new Map();

    const flowerPointPredicateWiring = createFlowerPointPredicateWiring();
    flowerPointPredicateWiring.forEach((val, key) => pointPredicateWiring.set(key, val));

    const handPointPredicateWiring = createHandPointPredicateWiring();
    handPointPredicateWiring.forEach((val, key) => pointPredicateWiring.set(key, val));
    
    const meldBasedPointPredicateWiring = createMeldBasedPointPredicateWiring();
    meldBasedPointPredicateWiring.forEach((val, key) => pointPredicateWiring.set(key, val));

    const tileBasedPointPredicateWiring = createTileBasedPointPredicateWiring();
    tileBasedPointPredicateWiring.forEach((val, key) => pointPredicateWiring.set(key, val));

    const winConditionPointPredicateWiring = createWinConditionPointPredicateWiring();
    winConditionPointPredicateWiring.forEach((val, key) => pointPredicateWiring.set(key, val));

    return pointPredicateWiring;
}

