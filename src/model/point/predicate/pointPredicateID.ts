import { getEnumKeys } from "common/generic/enumUtils";

export enum PointPredicateID {
    /** Subpredicates - Composed with each other to make more complex predicates.
     * They do not give points by themselves in mahjong hands.
     * Subpredicates must start with the prefix "SUBPREDICATE" **/
    // Hand Subpredicates
    SUBPREDICATE_ONE_PAIR = 'SUBPREDICATE_ONE_PAIR',
    SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CHOWS = 'SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CHOWS',
    SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_KONGS = 'SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_KONGS',
    SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_PONGS_AND_KONGS = 'SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_PONGS_AND_KONGS',
    SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS = 'SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS',
    SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS_AND_KONGS = 'SUBPREDICATE_CONTAINS_FOUR_CONCEALED_PONGS_AND_KONGS',
    SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE = 'SUBPREDICATE_IF_THERE_IS_ONLY_ONE_EXPOSED_MELD_THEN_IT_IS_MELD_WITH_LAST_TILE',  
    SUBPREDICATE_ALL_MELDS_ARE_CONCEALED = 'SUBPREDICATE_ALL_MELDS_ARE_CONCEALED',  
    SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED = 'SUBPREDICATE_AT_LEAST_NUM_MELDS_MINUS_ONE_ARE_CONCEALED',
    SUBPREDICATE_ALL_MELDS_ARE_EXPOSED = 'SUBPREDICATE_ALL_MELDS_ARE_EXPOSED',  
    SUBPREDICATE_ALL_NON_PAIR_MELDS_ARE_EXPOSED = 'SUBPREDICATE_ALL_NON_PAIR_MELDS_ARE_EXPOSED',
    SUBPREDICATE_HAND_CONTAINS_NO_SUITS = 'SUBPREDICATE_HAND_CONTAINS_NO_SUITS',
    SUBPREDICATE_HAND_CONTAINS_ONE_SUIT = 'SUBPREDICATE_HAND_CONTAINS_ONE_SUIT',
    SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT = 'SUBPREDICATE_HAND_CONTAINS_MORE_THAN_ONE_SUIT',
    SUBPREDICATE_HAND_CONTAINS_HONORS = 'SUBPREDICATE_HAND_CONTAINS_HONORS',
    SUBPREDICATE_HAND_CONTAINS_NO_HONORS = 'SUBPREDICATE_HAND_CONTAINS_NO_HONORS',
    SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR = 'SUBPREDICATE_IF_LAST_TILE_WAS_DISCARD_THEN_IT_COMPLETED_PAIR',
    SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR = 'SUBPREDICATE_IF_LAST_TILE_WAS_SELF_DRAWN_THEN_IT_COMPLETED_PAIR',
    SUBPREDICATE_LAST_TILE_COMPLETED_PAIR = 'SUBPREDICATE_LAST_TILE_COMPLETED_PAIR',
    SUBPREDICATE_THREE_WINDS_PONG_KONG = 'SUBPREDICATE_THREE_WINDS_PONG_KONG', // hand has three pongs (kongs allowed) of different winds
    SUBPREDICATE_TWO_DRAGONS_PONG_KONG = 'SUBPREDICATE_TWO_DRAGONS_PONG_KONG',
    SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES = 'SUBPREDICATE_ALL_ONE_SUIT_WITH_SUFFICIENT_TILE_QUANTITIES_FOR_NINE_GATES',
    SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON = 'SUBPREDICATE_ALL_BAMBOO_AND_GREEN_DRAGON',
    SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON = 'SUBPREDICATE_ALL_CHARACTER_AND_RED_DRAGON',
    SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON = 'SUBPREDICATE_ALL_CIRCLE_AND_WHITE_DRAGON',
    // Pair Value Subpredicates
    SUBPREDICATE_DRAGON_PAIR = 'SUBPREDICATE_DRAGON_PAIR',
    SUBPREDICATE_WIND_PAIR = 'SUBPREDICATE_WIND_PAIR',
    SUBPREDICATE_VALUED_WIND_PAIR = 'SUBPREDICATE_VALUED_WIND_PAIR', // either seat and/or prevailing
    SUBPREDICATE_VALUELESS_WIND_PAIR = 'SUBPREDICATE_VALUELESS_WIND_PAIR', // neither seat nor prevailing
    SUBPREDICATE_VALUELESS_SUITED_PAIR = 'SUBPREDICATE_VALUELESS_SUITED_PAIR',
    SUBPREDICATE_VALUELESS_PAIR= 'SUBPREDICATE_VALUELESS_PAIR', // VALUELESS_WIND OR VALUELESS_SUITED
    // Win Condition Subpredicate
    SUBPREDICATE_WIN_WITH_INITIAL_HAND = 'SUBPREDICATE_WIN_WITH_INITIAL_HAND',
    SUBPREDICATE_NOT_SELF_DRAW = 'SUBPREDICATE_NOT_SELF_DRAW', // winning tile is a discard
    // Special Last Tile Hand 
    SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE = 'SUBPREDICATE_WINNING_TILE_IS_ONE_CIRCLE',
    SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE = 'SUBPREDICATE_WINNING_TILE_IS_FIVE_CIRCLE',
    SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW = 'SUBPREDICATE_WINNING_TILE_MELD_IS_FOUR_FIVE_SIX_CIRCLE_CHOW',
    SUBPREDICATE_WIN_BY_ANY_REPLACEMENT = 'SUBPREDICATE_WIN_BY_ANY_REPLACEMENT',
    SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT = 'SUBPREDICATE_WIN_BY_ANY_DOUBLE_REPLACEMENT',
    // Round Context Subpredicates
    SUBPREDICATE_SEAT_WIND_IS_EAST = 'SUBPREDICATE_SEAT_WIND_IS_EAST',
    SUBPREDICATE_NOT_SEAT_WIND_IS_EAST = 'SUBPREDICATE_NOT_SEAT_WIND_IS_EAST',
    
    CHICKEN_HAND = 'CHICKEN_HAND',
    ALL_CHOWS = 'ALL_CHOWS',
    COMMON_HAND = 'COMMON_HAND', // could be considered more complex than all chows
    ALL_PONGS_AND_KONGS = 'ALL_PONGS_AND_KONGS', // aka "ALL_IN_TRIPLETS"
    SEVEN_PAIRS = 'SEVEN_PAIRS',
    ALL_ONE_SUIT_AND_HONORS = 'ALL_ONE_SUIT_AND_HONORS', 
    ALL_ONE_SUIT = 'ALL_ONE_SUIT', // only one suit
    ALL_HONORS = 'ALL_HONORS', // only honors
    ALL_TERMINALS = 'ALL_TERMINALS', // AKA Orphans, only 1's and 9's, ALL_IN_TRIPLES not awarded
    ALL_HONORS_AND_TERMINALS = 'ALL_HONORS_AND_TERMINALS',
    ALL_SIMPLES = 'ALL_SIMPLES', // No honors or terminals, only suited values 2-9 in hand.
    VOIDED_SUIT = 'VOIDED_SUIT', // only two of three suits, honors optional
    SMALL_FOUR_WINDS = 'SMALL_FOUR_WINDS',
    BIG_FOUR_WINDS = 'BIG_FOUR_WINDS',
    SMALL_THREE_DRAGONS = 'SMALL_THREE_DRAGONS',
    BIG_THREE_DRAGONS = 'GREAT_THREE_DRAGONS',
    THIRTEEN_ORPHANS = 'THIRTEEN_ORPHANS', // Special hand
    ALL_KONGS = 'ALL_KONGS',
    // TODO SELF_TRIPLETS must be pongs or option to make it pongs and kongs
    SELF_TRIPLETS = 'SELF_TRIPLETS', // four concealed pongs/kongs, not even the last one.
    // can win from self-pick for pair only? no bonus for winning from wall
    NINE_GATES = 'NINE_GATES', // must win totally concealed, can only eat when waiting. 
    CONCEALED_HAND = 'CONCEALED_HAND', // the four non pair melds are concealed (except maybe the last one if won by discard), may or may not include SELF_DRAW last tile. can be customized.
    // the concealed hand may still count if the last self-drawn tile completes one of the four non pair melds depending on desired behavior (aka winning by discard on non pair meld is accepted)
    // default behavior: concealed hand counts if all four non pair melds are concealed and the last tile completes only the last non-pair meld, no restrictions on self-draw.
    FULLY_CONCEALED_HAND = 'FULLY_CONCEALED_HAND',
    MELDED_HAND = 'MELDED_HAND', // the four non pair melds are exposed, may or may not include SELF_DRAW last tile for the pair. can be customized.
    // the melded hand may still count if the last tile completes the last non-pair meld via discard.
    // default behavior: melded hand counts if all four non pair melds are revealed and the last tile completes the pair via discard.
    FULLY_MELDED_HAND = 'FULLY_MELDED_HAND', // four non pair melds are exposed, pair meld won via discard
    // a FULLY_CONCEALED_HAND = CONCEALED_HAND + SELF_DRAWN. the self drawn tile applies to any of the melds
    // a FULLY_MELDED_HAND = MELDED_HAND and no SELF_DRAWN present. the last tile must complete the pair.
    MOON_FROM_THE_BOTTOM_OF_THE_SEA = 'MOON_FROM_THE_BOTTOM_OF_THE_SEA',
    PLUM_BLOSSOM_ON_THE_ROOF = 'PLUM_BLOSSOM_ON_THE_ROOF',
    JADE_DRAGON = 'JADE_DRAGON',
    RUBY_DRAGON = 'RUBY_DRAGON',
    PEARL_DRAGON = 'PEARL_DRAGON',

    // Individual Melds
    SEAT_WIND_PONG_KONG = 'SEAT_WIND_PONG_KONG',
    PREVAILING_WIND_PONG_KONG = 'PREVAILING_WIND_PONG_KONG',
    RED_DRAGON_PONG_KONG = 'RED_DRAGON_PONG_KONG',
    GREEN_DRAGON_PONG_KONG = 'GREEN_DRAGON_PONG_KONG',
    WHITE_DRAGON_PONG_KONG = 'WHITE_DRAGON_PONG_KONG',

    // Wait based points
    PAIR_WAIT = 'PAIR_WAIT', // last tile can only complete the pair
    EDGE_WAIT = 'EDGE_WAIT', // last tile can only be a 3 in a 1,2,3 chow or 7,8,9 chow, not at the same time.
    CLOSED_WAIT = 'CLOSED_WAIT', // last tile can only complete the chow in the middle

    SELF_DRAW = 'SELF_DRAW', // winning tile is NOT a discard
    LAST_OF_ITS_KIND = 'LAST_OF_ITS_KIND', // the winning tile is the last of its kind based on what's been melded/discarded by other players.
    ROBBING_KONG = 'ROBBING_KONG',  // win by having priority over someone else's call to add that tile to a melded kong
    WIN_BY_LAST_TILE = 'WIN_BY_LAST_TILE', // win by last tile on wall
    WIN_BY_LAST_DISCARD = 'WIN_BY_LAST_DISCARD', // win by last discard of game
    WIN_BY_KONG = 'WIN_BY_KONG', // win via replacement tile from kong
    WIN_BY_FLOWER = 'WIN_BY_FLOWER', // win via replacement tile from flower
    WIN_BY_DOUBLE_KONG = 'WIN_BY_DOUBLE_KONG', // win via replacement tile of kong after replacement tile from kong
    WIN_BY_DOUBLE_FLOWER = 'WIN_BY_DOUBLE_FLOWER', // win via replacement tile after drawing two flowers in a row
    WIN_BY_MIXED_DOUBLE_REPLACEMENT = 'WIN_BY_MIXED_DOUBLE_REPLACEMENT',
    EARTHLY_HAND = 'EARTHLY_HAND',
    HEAVENLY_HAND = 'HEAVENLY_HAND',

    // Bonus tile points
    SEAT_GENTLEMAN = 'SEAT_GENTLEMAN',
    SEAT_SEASON = 'SEAT_SEASON',
    PREVAILING_GENTLEMAN = 'PREVAILING_GENTLEMAN',
    PREVAILING_SEASON = 'PREVAILING_SEASON',
    ANY_GENTLEMAN_OR_SEASON = 'ANY_GENTLEMAN_OR_SEASON',
    ALL_GENTLEMEN = 'ALL_GENTLEMEN',
    ALL_SEASONS = 'ALL_SEASONS',
    ALL_GENTLEMAN_AND_SEASONS = 'ALL_GENTLEMEN_AND_SEASONS',
    NO_GENTLEMEN_OR_SEASONS = 'NO_GENTLEMEN_OR_SEASONS',
}

export const subpredicateIds: ReadonlySet<PointPredicateID> = new Set(...[
    getEnumKeys(PointPredicateID)
        .filter(key => key.includes("SUBPREDICATE"))
        .map(key => PointPredicateID[key])
]);