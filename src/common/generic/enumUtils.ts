export function getEnumKeys<T extends object, K = keyof T>(tileValueEnum: T): K[] {
    return Object.keys(tileValueEnum).filter(k => isNaN(Number(k))) as K[];
}