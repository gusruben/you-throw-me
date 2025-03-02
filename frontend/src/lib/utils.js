export function processScore(score) {
    score = Math.round(score * 100) * 10;

    return score;
}