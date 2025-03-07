export function getEnumKeys<T extends object, K = keyof T>(anEnum: T): K[] {
    return Object.keys(anEnum).filter(k => isNaN(Number(k))) as K[];
}