import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { ALL_GENTLEMEN_AND_SEASONS_PREDICATE, ALL_GENTLEMEN_PREDICATE, ALL_SEASONS_PREDICATE, NO_GENTLEMEN_OR_SEASONS_PREDICATE, PREVAILING_GENTLEMAN_PREDICATE, PREVAILING_SEASON_PREDICATE, SEAT_GENTLEMAN_PREDICATE, SEAT_SEASON_PREDICATE } from "service/point/predicate/impl/flower/flowerPredicate";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";

export default function createFlowerPointPredicateWiring(): Map<PointPredicateID, PointPredicate<WinningHand>> {
    const map: Map<PointPredicateID, PointPredicate<WinningHand>> = new Map();

    map.set(PointPredicateID.NO_GENTLEMEN_OR_SEASONS, NO_GENTLEMEN_OR_SEASONS_PREDICATE);
    map.set(PointPredicateID.SEAT_GENTLEMAN, SEAT_GENTLEMAN_PREDICATE);
    map.set(PointPredicateID.SEAT_SEASON, SEAT_SEASON_PREDICATE);
    map.set(PointPredicateID.ALL_GENTLEMEN, ALL_GENTLEMEN_PREDICATE);
    map.set(PointPredicateID.ALL_SEASONS, ALL_SEASONS_PREDICATE);
    map.set(PointPredicateID.PREVAILING_GENTLEMAN, PREVAILING_GENTLEMAN_PREDICATE);
    map.set(PointPredicateID.PREVAILING_SEASON, PREVAILING_SEASON_PREDICATE);
    map.set(PointPredicateID.ALL_GENTLEMAN_AND_SEASONS, ALL_GENTLEMEN_AND_SEASONS_PREDICATE);
    
    return map;
}
