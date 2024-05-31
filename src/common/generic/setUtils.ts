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

export function consolidateSets<T>(setArray: Set<T>[]): Set<T> {
    return setArray.reduce((accum, set) => {[...set.values()].forEach(item => accum.add(item)); return accum;}, new Set<T>());
}

export function wrapSet<T>(set: Set<T>): Set<Set<T>> {
    const wrapper : Set<Set<T>> = new Set();
    wrapper.add(set);
    return wrapper;
}