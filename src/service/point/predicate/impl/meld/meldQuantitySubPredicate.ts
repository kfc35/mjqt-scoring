import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "service/point/predicate/pointPredicate";
import { createChowQuantityPredicate } from "service/point/predicate/factory/meldBased/chowPredicateFactory";
import { createPongOrKongQuantityPredicate } from "service/point/predicate/factory/meldBased/pongOrKongPredicateFactory";
import { createKongQuantityPredicate } from "service/point/predicate/factory/meldBased/kongPredicateFactory";

export const containsFourChowsSubPredicate: PointPredicate<MeldBasedWinningHand> = createChowQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CHOWS, 4);
export const containsFourKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createKongQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_KONGS, 4);
export const containsFourPongsKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createPongOrKongQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_PONGS_AND_KONGS, 4);
