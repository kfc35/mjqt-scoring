// all honors
// some honors
// no honors

export function createNumHonorTileGroupsPredicate(pointPredicateID: string, desiredNumHonorTileGroups: number) : PointPredicate<StandardWinningHand> {
    return (winningHand: StandardWinningHand) => {
        const tileGroupsToTiles = createTileGroupsToTilesMap(winningHand);
        let numHonorTileGroups = 0;
        honorTileGroups.forEach((group) => {if (tileGroupsToTiles.has(group)) { numHonorTileGroups++ }});
        if (numHonorTileGroups !== desiredNumHonorTileGroups) {
            // have to put offending tiles.
            return new PointPredicateResult(pointPredicateID, false, [], []);
        }
        // put the honor tiles here.
        return new PointPredicateResult(pointPredicateID, true, winningHand.getContents(), []);
    }
}