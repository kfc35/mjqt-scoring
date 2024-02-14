export enum WinCondition {
    CHICKEN = 'CHICKEN',
    MIXED_ORPHANS = 'MIXED_ORPHANS',
    COMMON = 'COMMON', // All Chows
    ALL_IN_TRIPLETS = 'ALL_IN_TRIPLETS',
    SEVEN_PAIRS = 'SEVEN_PAIRS',
    MIXED_ONE_SUIT = 'MIXED_ONE_SUIT',
    ALL_ONE_SUIT = 'ALL_ONE_SUIT',
    ALL_HONORS = 'ALL_HONORS', // ALL_IN_TRIPLETS not awarded
    SMALL_DRAGONS = 'SMALL_DRAGONS',
    GREAT_DRAGONS = 'GREAT_DRAGONS',
    SMALL_WINDS = 'SMALL_WINDS',
    GREAT_WINDS = 'GREAT_WINDS',
    THIRTEEN_ORPHANS = 'THIRTEEN_ORPHANS', //special win condition.
    ALL_KONGS = 'ALL_KONGS',
    SELF_TRIPLETS = 'SELF_TRIPLETS', // four concealed pongs/kongs, not even the last one.
    // can win from self-pick but no bonus for winning from wall
    ORPHANS = 'ORPHANS', // ALL_IN_TRIPLETS not counted.
    NINE_GATES = 'NINE_GATES', // must win totally concealed, can only eat when waiting.    
}
// TODO TestHandForWindCondition