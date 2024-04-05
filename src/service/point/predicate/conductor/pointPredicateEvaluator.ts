// Given a winning hand, return a list of all the pointcriterion it gets.
// for each point criterion, there should be an associated object with details
// i.e. which meld(s) satisfies the point criterion, the whole hand, etc.

// Then we have to convert applicable point criterion to faan based on existing faan.
// Point criterion dont have a 1:1 relationship with faan.
// A faan evaluator takes a list of point criterion, removes some, and gives a point value.
// Evaluating Faan has to be done from most complicated hand to least. This is because
// some higher faan include lower faan.