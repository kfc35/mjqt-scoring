export enum PointPredicateResultCode {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    // TODO how do we feel about considering this a success or a failure?
    SUCCESS_IGNORED_CONDITION_NOT_APPLICABLE = 'IGNORED_CONDITION_NOT_APPLICABLE', // the "if" part of an "if...then predicate " is false
    /** The following IGNORE codes are used in "International Rules" */
    SUCCESS_IGNORED_NON_REPEAT_PRINCIPLE = 'IGNORED_NON_REPEAT_PRINCIPLE', // included by another result
    // non_separation_principle is guaranteed because the melds in a winning hand are rigid in code.
    SUCCESS_IGNORED_NON_IDENTICAL_PRINCIPLE = 'IGNORED_NON_IDENTICAL_PRINCIPLE',
    SUCCESS_IGNORED_EXCLUSIONARY_PRINCIPLE = 'IGNORED_EXCLUSIONARY_PRINCIPLE',
}