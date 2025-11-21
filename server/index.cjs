// server/index.cjs
const express = require("express");
const cors = require("cors");
const { generateCrimeRate } = require("./ibm.cjs");
const { generateForecast } = require("./ibm-forecast.cjs");
const { computeInvestmentScore } = require("./investScore.cjs");

const app = express();
app.use(cors());

// Crime rate (already existing)
app.get("/api/crime-rate", async (req, res) => {
    const { neighborhood } = req.query;

    try {
        const rate = await generateCrimeRate(neighborhood);
        res.json({ crimeRate: rate });
    } catch (err) {
        res.json({ crimeRate: "0" });
    }
});

// NEW — 5 Year Forecast
app.get("/api/forecast", async (req, res) => {
    const { neighborhood, median } = req.query;

    try {
        const forecast = await generateForecast(neighborhood, median);
        res.json({ forecast });
    } catch (err) {
        res.json({ forecast: "0" });
    }
});

app.get("/api/invest-score", (req, res) => {
    const { crimeRate, current, forecast } = req.query;

    const score = computeInvestmentScore(crimeRate, current, forecast);
    res.json({ score });
});

app.get("/api/chat", async (req, res) => {
  const question = req.query.q;
  const neighborhood = req.query.neighborhood;

  if (!question) return res.status(400).json({ error: "Missing question" });

  try {
    const answer = await generateChatAnswer(neighborhood, question);
    res.json({ answer });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Chat AI error" });
  }
});


app.listen(5000, () => console.log("API running on http://localhost:5000"));
