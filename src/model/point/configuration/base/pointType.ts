export const MAX_POINTS = "MAX" as const;
export type PointType = number | typeof MAX_POINTS;

export function strIsPointType(str: string): boolean {
    return str === MAX_POINTS || !isNaN(Number(str));
}

export function convertToPointType(str: string): PointType | undefined {
    if (str === MAX_POINTS) {
        return MAX_POINTS;
    }
    if (!isNaN(Number(str))) {
        return Number(str);
    }
    return undefined;
}