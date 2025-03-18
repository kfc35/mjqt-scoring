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

export function pointTypeToNumber(pts: PointType | undefined, maxPoints: number): number {
    if (pts === MAX_POINTS) {
        return maxPoints;
    }
    return pts ?? 0;
}

export function addPoints(accum: number, pts: PointType | undefined, maxPoints: number): number {
    if (pts === MAX_POINTS) {
        return accum + maxPoints;
    }
    if (!!pts) {
        return accum + pts;
    }
    return accum;
}