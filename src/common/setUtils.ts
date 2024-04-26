/** Use this only if you are sure it is a singleton set. */
export function getOnlyElement<T>(singletonSet: ReadonlySet<T>): T | undefined {
    const setArray = Array.from(singletonSet);
    if (setArray.length !== 1) {
        throw new Error("Expected Set to have only one element, but it has multiple: " + singletonSet.size);
    }
    return setArray[0];
}

/** Use this only if you are sure it is a singleton set. */
export function getOnlyTruthyElement<T>(singletonSet: ReadonlySet<T>): T {
    const setArray = Array.from(singletonSet);
    if (setArray.length !== 1 || !setArray[0]) {
        throw new Error("Expected Set to have only one element, but it has multiple: " + singletonSet.size);
    }
    return setArray[0];
}