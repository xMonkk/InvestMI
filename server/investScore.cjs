function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function computeInvestmentScore(crimeRate, currentPrice, forecastPrice) {
    if (!crimeRate || !currentPrice || !forecastPrice) {
        return 50; // fallback
    }

    crimeRate = Number(crimeRate);
    currentPrice = Number(currentPrice);
    forecastPrice = Number(forecastPrice);

    // 1. Growth Score (0–100)
    const growthPercent = ((forecastPrice - currentPrice) / currentPrice) * 100;
    const growthScore = clamp(growthPercent, 0, 100);

    // 2. Crime Score (0–100)
    const crimeScore = clamp(100 - crimeRate, 0, 100);

    // 3. Value Stability Score (0–100)
    const valueScore = clamp((currentPrice / 400000) * 100, 0, 100);

    // Final Weighted Score
    const score =
        0.40 * growthScore +
        0.35 * crimeScore +
        0.25 * valueScore;

    return Math.round(score);
}

module.exports = { computeInvestmentScore };
