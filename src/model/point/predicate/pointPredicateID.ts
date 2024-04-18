

export enum PointPredicateID {
    ALL_CHOWS = 'ALL_CHOWS',
    ALL_PONGS_AND_KONGS = 'ALL_PONGS_AND_KONGS', // aka all pongs/kongs
    SEVEN_PAIRS = 'SEVEN_PAIRS',
    ALL_ONE_SUIT_AND_HONORS = 'ALL_ONE_SUIT_AND_HONORS', 
    ALL_ONE_SUIT = 'ALL_ONE_SUIT', // only one suit
    ALL_HONORS = 'ALL_HONORS', // only honors
    ALL_TERMINALS = 'ALL_TERMINALS', // AKA Orphans, only 1's and 9's, ALL_IN_TRIPLES not awarded
    ALL_HONORS_AND_TERMINALS = 'ALL_HONORS_AND_TERMINALS',
    THREE_WINDS_PONG = 'THREE_WINDS_PONG', // hand has three pongs (kongs allowed) of different winds
    FOUR_WINDS_PONG = 'FOUR_WINDS_PONG', // hand has four pongs (kongs allowed) of diff winds
    THIRTEEN_ORPHANS = 'THIRTEEN_ORPHANS', // Special hand
    ALL_KONGS = 'ALL_KONGS',
    // TODO might be something else
    SELF_TRIPLETS = 'SELF_TRIPLETS', // four concealed pongs/kongs, not even the last one.
    // can win from self-pick for pair only? no bonus for winning from wall
    NINE_GATES = 'NINE_GATES', // must win totally concealed, can only eat when waiting.    
    CONCEALED_HAND = 'CONCEALED_HAND', // the four non pair melds are concealed (except maybe the last one if won by discard), may or may not include SELF_DRAW last tile. can be customized.
    // the concealed hand may still count if the last self-drawn tile completes one of the four non pair melds depending on desired behavior (aka winning by discard on non pair meld is accepted)
    // default behavior: concealed hand counts if all four non pair melds are concealed and the last tile completes only the last non-pair meld, no restritions on self-draw.
    MELDED_HAND = 'MELDED_HAND', // the four non pair melds are revealed, may or may not include SELF_DRAW last tile for the pair. can be customized.
    // the melded hand may still count if the last tile completes the last non-pair meld via discard.
    // default behavior: melded hand counts if all four non pair melds are revealed and the last tile completes the pair via discard.
    // a FULLY_CONCEALED_HAND = CONCEALED_HAND + SELF_DRAWN. the self drawn tile applies to any of the melds
    // a FULLY_MELDED_HAND = MELDED_HAND and no SELF_DRAWN present. the last tile must complete the pair.
    MOON_FROM_THE_BOTTOM_OF_THE_SEA = 'MOON_FROM_THE_BOTTOM_OF_THE_SEA',
    PLUM_BLOSSOM_ON_THE_ROOF = 'PLUM_BLOSSOM_ON_THE_ROOF',

    // Individual Melds
    SEAT_WIND_PONG = 'SEAT_WIND_PONG',
    PREVAILING_WIND_PONG = 'PREVAILING_WIND_PONG',
    RED_DRAGON_PONG = 'RED_DRAGON_PONG',
    GREEN_DRAGON_PONG = 'GREEN_DRAGON_PONG',
    WHITE_DRAGON_PONG = 'WHITE_DRAGON_PONG',

    DRAGON_PAIR = 'DRAGON_PAIR',
    VALUED_WIND_PAIR = 'VALUED_WIND_PAIR', // either seat and/or prevailing
    VALUELESS_WIND_PAIR = 'VALUELESS_WIND_PAIR', // neither seat nor prevailing
    VALUELESS_SUITED_PAIR = 'VALUELESS_SUITED_PAIR', 

    PAIR_WAIT = 'PAIR_WAIT', // last tile can only complete the pair
    EDGE_WAIT = 'EDGE_WAIT', // last tile can only be a 3 in a 1,2,3 chow or 7,8,9 chow, not at the same time.
    CLOSED_WAIT = 'CLOSED_WAIT', // last tile can only complete the chow in the middle

    SELF_DRAW = 'SELF_DRAW', // winning tile is NOT a discard
    LAST_OF_IS_KIND = 'LAST_OF_ITS_KIND', // the winning tile is the last of its kind based on what's been melded/discarded by other players.
    ROBBING_KONG = 'ROBBING_KONG',  // win by having priority over someone else's call to add that tile to a melded kong
    WIN_BY_LAST_TILE = 'WIN_BY_LAST_TILE', // win by last tile on wall
    WIN_BY_LAST_DISCARD = 'WIN_BY_LAST_DISCARD', // win by last discard of game
    WIN_BY_KONG = 'WIN_BY_KONG', // win via replacement tile from kong
    WIN_BY_FLOWER = 'WIN_BY_FLOWER', // win via replacement tile from flower
    WIN_BY_DOUBLE_KONG = 'WIN_BY_DOUBLE_KONG', // win via replacement tile of kong after replacement tile from kong
    WIN_BY_DOUBLE_FLOWER = 'WIN_BY_DOUBLE_FLOWER', // win via replacement tile after drawing two flowers in a row
    WIN_WITH_INITIAL_HAND = 'WIN_WITH_INITIAL_HAND',

    // Bonus tile points
    SEAT_GENTLEMAN = 'SEAT_GENTLEMAN',
    SEAT_SEASON = 'SEAT_SEASON',
    PREVAILING_GENTLEMAN = 'PREVAILING_GENTLEMAN',
    PREVAILING_SEASON = 'PREVAILING_SEASON',
    // TODO in chinese competition rules, you have to count the number of flower tiles...
    ANY_GENTLEMAN_OR_SEASON = 'ANY_GENTLEMAN_OR_SEASON',
    ALL_GENTLEMEN = 'ALL_GENTLEMEN',
    ALL_SEASONS = 'ALL_SEASONS',
    ALL_GENTLEMAN_AND_SEASONS = 'ALL_GENTLEMEN_AND_SEASONS',
    NO_GENTLEMEN_OR_SEASONS = 'NO_GENTLEMEN_OR_SEASONS',
}