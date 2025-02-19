import { MeldBasedWinningHand } from "model/hand/hk/winningHand/meldBasedWinningHand";
import { PointPredicateID } from "model/point/predicate/pointPredicateID";
import { PointPredicate } from "../../pointPredicate";
import { createChowQuantityPredicate } from "../../factory/meldBased/chowPredicateFactory";
import { createPongQuantityPredicate } from "../../factory/meldBased/pongPredicateFactory";
import { createPongOrKongQuantityPredicate } from "../../factory/meldBased/pongOrKongPredicateFactory";

export const containsFourChowsSubPredicate: PointPredicate<MeldBasedWinningHand> = createChowQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_CHOWS, 4);
export const containsFourKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createPongQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_KONGS, 4);
export const containsFourPongsKongsSubPredicate: PointPredicate<MeldBasedWinningHand> = createPongOrKongQuantityPredicate(PointPredicateID.SUBPREDICATE_CONTAINS_FOUR_PONGS_AND_KONGS, 4);

