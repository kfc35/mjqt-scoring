export enum WinContextFaan {
    SELF_DRAW = 'SELF_DRAW',
    ROBBING_KONG = 'ROBBING_KONG', 
    WIN_BY_LAST_TILE = 'WIN_BY_LAST_TILE', // win by last tile on wall
    WIN_BY_LAST_DISCARD = 'WIN_BY_LAST_DISCARD', // win by last discard of game
    WIN_BY_KONG = 'WIN_BY_KONG', // win via replacement tile
    WIN_BY_DOUBLE_KONG = 'WIN_BY_DOUBLE_KONG', 
    WIN_BY_FLOWER = 'WIN_BY_FLOWER',
    WIN_BY_DOUBLE_FLOWER = 'WIN_BY_DOUBLE_FLOWER',
    HEAVENLY_HAND = 'HEAVENLY_HAND', // east's initial hand is a winning hand
    EARTHLY_HAND = 'EARTHLY_HAND', // non east player wins on east's first discard
}