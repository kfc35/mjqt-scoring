export function pushToMapValueArray<K, V>(map: Map<K, V[]>, key: K, ...values: V[]) {
    const array = map.get(key);
    if (array) {
        array.push(...values);
    } else {
        map.set(key, [...values]);
    }
}

export function addToMapValueSet<K, V>(map: Map<K, Set<V>>, key: K, ...values: V[]) {
    const set = map.get(key);
    if (set) {
        values.forEach(value => set.add(value));
    } else {
        map.set(key, new Set([...values]));
    }
}