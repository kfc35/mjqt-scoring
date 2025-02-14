// To check for other possible waits... (works with all other wait)
// Take all the tiles for the same suit as the winning tile if it is a suited tile. they must be from concealed melds.
// Try to find all possible meld combinations from these tiles, 
// but get the list of tiles that would be used to complete the last set
// If there is more than one unique tile that can complete all of the possible last sets, it is not a special wait.
// If there is only one unique tile, then it is a single wait (closed/edge/pair).
// could try and reuse written code to do this.

// This also means that, for example, if you have [1,1,1,2,2,3,3,3] in the same suit, and you need a 2, 
// it still counts as a single wait since it can count as a closed wait for [1,2,3]
// even though it can also be used to complete a pong of [2,2,2]. It's still only a SINGLE tile wait.
// plus, there will be another hand possibility evaluated via other code that would take care of the pong possibility here.