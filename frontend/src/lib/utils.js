export function processScore(score, totalGyroscopeCoefficient, randomStrength, interactionSpeedScale) {
    return Math.pow((Math.round(score * 100) * 10 * totalGyroscopeCoefficient), 1 + (Math.random() * (randomStrength - 1))) / interactionSpeedScale;
}