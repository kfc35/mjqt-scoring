import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicateLogicOption } from "./pointPredicateLogicOption";

export const pointPredicateIdToLogicOptionsMap: Map<string, Set<string>> = createPointPredicateIdToLogicOptionsMap();

function createPointPredicateIdToLogicOptionsMap(): Map<string, Set<string>> {
    const pointPredicateIdToLogicOptionsMap: Map<string, Set<string>> = new Map();

    pointPredicateIdToLogicOptionsMap.set(PointPredicateID.CONCEALED_HAND, 
        new Set([PointPredicateLogicOption.CONCEALED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR]));
    
    pointPredicateIdToLogicOptionsMap.set(PointPredicateID.MELDED_HAND, 
        new Set([PointPredicateLogicOption.MELDED_HAND_ALLOW_SELF_DRAW_TO_COMPLETE_PAIR,
            PointPredicateLogicOption.MELDED_HAND_LAST_DISCARDED_TILE_MUST_COMPLETE_PAIR
        ]));
    
    pointPredicateIdToLogicOptionsMap.set(PointPredicateID.SELF_TRIPLETS, 
        new Set([PointPredicateLogicOption.SELF_TRIPLETS_ONLY_PONGS_ALLOWED
        ]));
    
    pointPredicateIdToLogicOptionsMap.set(PointPredicateID.PLUM_BLOSSOM_ON_THE_ROOF, 
        new Set([PointPredicateLogicOption.PLUM_BLOSSOM_ON_ROOF_ANY_REPLACEMENT_ALLOWED
        ]));
    
    pointPredicateIdToLogicOptionsMap.set(PointPredicateID.COMMON_HAND, 
        new Set([PointPredicateLogicOption.COMMON_HAND_MUST_HAVE_VALUELESS_PAIR
        ]));

    return pointPredicateIdToLogicOptionsMap;
}