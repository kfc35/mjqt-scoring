// hand is all simples
// hand is all terminals
// hand's suited tiles are all terminals (may contain honors)

// hand all terminals => hand's suited tiles are all terminals, but the converse is not necessarily true

// Of the hand's SuitedTiles, those tiles only have the listed SuitedTileValues.
// If the hand has no SuitedTiles, it passes the predicate.
export function createSuitedTileValuePredicate(pointPredicateID: string, desiredSuitedTileValues: ReadonlySet<SuitedTileValue>) : PointPredicate<StandardWinningHand> {
    return (winningHand: StandardWinningHand) => {
        const tileValuesToTiles = createTileValuesToTilesMap(winningHand);
        const undesiredSuitedTileValues = suitedTileValues.filter(tileValue => desiredSuitedTileValues.indexOf(tileValue) === -1);
        const desiredSuitedTiles : Tile[][] = [];
        const undesiredSuitedTiles : Tile[][] = [];
        for (const undesiredSuitedTileValue of undesiredSuitedTileValues) {
            const badTiles = tileValuesToTiles.get(undesiredSuitedTileValue);
            if (badTiles) {
                undesiredSuitedTiles.push(badTiles);
            }
        }
        if (undesiredSuitedTiles.length !== 0) {
            return new PointPredicateResult(pointPredicateID, false, undesiredSuitedTiles, []);
        }

        for (const desiredSuitedTileValue of desiredSuitedTileValues) {
            const okTiles = tileValuesToTiles.get(desiredSuitedTileValue);
            if (okTiles) {
                desiredSuitedTiles.push(okTiles);
            }
        }
        return new PointPredicateResult(pointPredicateID, true, desiredSuitedTiles, []);
    }
}
