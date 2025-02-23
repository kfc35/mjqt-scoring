import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { WinningHand } from "model/hand/hk/winningHand/winningHand";
import { EARTHLY_HAND_PREDICATE, HEAVENLY_HAND_PREDICATE, LAST_OF_ITS_KIND_PREDICATE, ROBBING_KONG_PREDICATE, SELF_DRAW_PREDICATE, WIN_BY_DOUBLE_FLOWER_PREDICATE, WIN_BY_DOUBLE_KONG_PREDICATE, WIN_BY_FLOWER_PREDICATE, WIN_BY_KONG_PREDICATE, WIN_BY_LAST_DISCARD_PREDICATE, WIN_BY_LAST_TILE_PREDICATE, WIN_BY_MIXED_DOUBLE_PREDICATE } from "service/point/predicate/impl/winCondition/basicWinConditionPredicate";
import { MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE } from "service/point/predicate/impl/winCondition/moonFromBottomOfSeaPredicate";
import { PLUM_BLOSSOM_ON_ROOF_PREDICATE } from "service/point/predicate/impl/winCondition/plumBlossomOnRoofPredicate";

export default function createWinConditionPointPredicateWiring(): Map<PointPredicateID, PointPredicate<WinningHand>> {
    const map: Map<PointPredicateID, PointPredicate<WinningHand>> = new Map();

    map.set(PointPredicateID.SELF_DRAW, SELF_DRAW_PREDICATE);
    map.set(PointPredicateID.LAST_OF_ITS_KIND, LAST_OF_ITS_KIND_PREDICATE);
    map.set(PointPredicateID.ROBBING_KONG, ROBBING_KONG_PREDICATE);
    map.set(PointPredicateID.WIN_BY_LAST_TILE, WIN_BY_LAST_TILE_PREDICATE);
    map.set(PointPredicateID.WIN_BY_LAST_DISCARD, WIN_BY_LAST_DISCARD_PREDICATE);

    map.set(PointPredicateID.WIN_BY_KONG, WIN_BY_KONG_PREDICATE);
    map.set(PointPredicateID.WIN_BY_DOUBLE_KONG, WIN_BY_DOUBLE_KONG_PREDICATE);
    map.set(PointPredicateID.WIN_BY_FLOWER, WIN_BY_FLOWER_PREDICATE);
    map.set(PointPredicateID.WIN_BY_DOUBLE_FLOWER, WIN_BY_DOUBLE_FLOWER_PREDICATE);
    map.set(PointPredicateID.WIN_BY_MIXED_DOUBLE_REPLACEMENT, WIN_BY_MIXED_DOUBLE_PREDICATE);

    map.set(PointPredicateID.EARTHLY_HAND, EARTHLY_HAND_PREDICATE);
    map.set(PointPredicateID.HEAVENLY_HAND, HEAVENLY_HAND_PREDICATE);

    map.set(PointPredicateID.MOON_FROM_THE_BOTTOM_OF_THE_SEA, MOON_FROM_THE_BOTTOM_OF_THE_SEA_PREDICATE);
    map.set(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF, PLUM_BLOSSOM_ON_ROOF_PREDICATE);
    return map;
}