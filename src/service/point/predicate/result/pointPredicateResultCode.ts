export enum PointPredicateResultCode {
    SUCCESS = 'SUCCESS',
    IGNORED_NON_REPEAT_PRINCIPLE = 'IGNORED_NON_REPEAT_PRINCIPLE', // included by another result
    IGNORED_NON_IDENTICAL_PRINCIPLE = 'IGNORED_NON_IDENTICAL_PRINCIPLE',
    IGNORED_EXCLUSIONARY_PRINCIPLE = 'IGNORED_EXCLUSIONARY_PRINCIPLE',
    IGNORED_CONDITION_NOT_APPLICABLE = 'IGNORED_CONDITION_NOT_APPLICABLE', // the "if" part of an "if...then predicate " is false.
    FAILURE = 'FAILURE',
}