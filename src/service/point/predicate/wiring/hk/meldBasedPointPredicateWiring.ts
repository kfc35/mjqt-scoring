import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { BIG_THREE_DRAGONS_PREDICATE, GREEN_DRAGON_PONG_KONG_PREDICATE, RED_DRAGON_PONG_KONG_PREDICATE, SMALL_THREE_DRAGONS_PREDICATE, WHITE_DRAGON_PONG_KONG_PREDICATE } from "service/point/predicate/impl/meld/dragonPongPredicate";
import { BIG_FOUR_WINDS_PREDICATE, PREVAILING_WIND_PONG_KONG_PREDICATE, SEAT_WIND_PONG_KONG_PREDICATE, SMALL_FOUR_WINDS_PREDICATE } from "service/point/predicate/impl/meld/windPongPredicate";

export default function createMeldBasedPointPredicateWiring(): Map<PointPredicateID, PointPredicate<WinningHand>> {
    const map: Map<PointPredicateID, PointPredicate<WinningHand>> = new Map();

    map.set(PointPredicateID.GREEN_DRAGON_PONG_KONG, GREEN_DRAGON_PONG_KONG_PREDICATE);
    map.set(PointPredicateID.RED_DRAGON_PONG_KONG, RED_DRAGON_PONG_KONG_PREDICATE);
    map.set(PointPredicateID.WHITE_DRAGON_PONG_KONG, WHITE_DRAGON_PONG_KONG_PREDICATE);
    map.set(PointPredicateID.SMALL_THREE_DRAGONS, SMALL_THREE_DRAGONS_PREDICATE);
    map.set(PointPredicateID.BIG_THREE_DRAGONS, BIG_THREE_DRAGONS_PREDICATE);
    
    map.set(PointPredicateID.SEAT_WIND_PONG_KONG, SEAT_WIND_PONG_KONG_PREDICATE);
    map.set(PointPredicateID.PREVAILING_WIND_PONG_KONG, PREVAILING_WIND_PONG_KONG_PREDICATE);
    map.set(PointPredicateID.SMALL_FOUR_WINDS, SMALL_FOUR_WINDS_PREDICATE);
    map.set(PointPredicateID.BIG_FOUR_WINDS, BIG_FOUR_WINDS_PREDICATE);
    
    return map;
}