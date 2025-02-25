# mjqt-scoring
Typescript Utilities to calculate a given hand's Mahjong score.

## For Consumers

### Install mjqt-scoring as a dependency

mjqt-scoring is available via npm. Run `npm install mjqt-scoring` in your project.

### Main Functionality

For consumers, the main function to calculate a hand's point value is within `src/api/scorer.ts`. `evaluateHand()` takes a `Hand` argument, a `WinContext` describing how the user won, the `RoundContext` describing the user's current seat and the prevailing wind, and a `RootPointPredicateConfiguration` that describes the current pointing rules (a default one is provided called `defaultRootPointPredicateConfiguration` that can be cloned and customized). It returns a `PointEvaluation`, which contains how many points the hand scored, a verbose result list describing which points the `Hand` successfully received, and a list of `PointPredicateID`s that were ignored when adding up the hand's points (due to already being included by an encompassing successful pointing rule).

### Deck

For ease of constructing tiles, the standard tileset used in Hong Kong and International rulesets are available in `src/common/deck.ts`.

## For Contributors

### Running Locally

After cloning the repo, run `npm install`. 
To compile, run `npm run build`.
To run tests, run `npm run test`.

## Model

### Tile

A `Tile` has two main attributes: a `group: TileGroup` and a `value: TileValue`. For example, the One of Bamboo has `group = TileGroup.BAMBOO` and `value = SuitedTileValue.ONE`.

### Meld

A `Meld` is a set of tiles that makes up a "meld" in the game of Mahjong, either a consecutive run (`Chow`), or a set of identical tiles: a pair (`Pair`), three of a kind (`Pong`), four of a kind (`Kong`).

### PointPredicate, PointPredicateResult, and PointPredicateID

For a typical Mahjong hand, you are awarded points if your win passes certain conditions, e.g. your hand is made up of a pair and four `Pong`/`Kong`s. This condition is commonly called "All Triplets" (or, in Chinese, 對對糊). Such a condition in this code base is encompassed in what is called a `PointPredicate`.

A `PointPredicate` is a function that takes in a `WinningHand` and returns a `PointPredicateResult`. A `PointPredicateResult` contains whether the `PointPredicate` is true or false for this hand, with verbose explanations as to what in the hand caused the predicate to evaluate to true/false. This `PointPredicate` is assigned an ID in `PointPredicateID` to keep track of all the rules. For "All Triplets", it has been given the id of `PointPredicateID.ALL_PONGS_AND_KONGS`. 

### Hand => HandAnalyzer => WinningHand

 A `Hand` is just a list of `Tile`s, the `mostRecentTileContext`, and an optional specification of pre-specified `Meld`s. It represents a person's hand of tiles when it is *their* turn (i.e. in 13-Tile Mahjong, it is when the user has 14 tiles). After the hand has been analyzed for win conditions via `HandAnalyzer`'s, the hand may transform into zero, one, or more `WinningHand`s. A `WinningHand` is either a `MeldBasedWinningHand` (one that conforms to a typical one pair + four meld structure in 13-tile Mahjong) or a `SpecialWinningHand` (anything that does not conform to the aforementioned pattern e.g. "Thirteen Orphans" / 十三么).