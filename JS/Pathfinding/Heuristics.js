// Heuristics.

export function manhattanDistance(start, end) {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

export function euclideanDistance(start, end) {
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
}

