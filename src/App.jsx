import { useState } from "react";
import MapMichigan from "./components/MapMichigan";
import { fetchCrimeRate } from "./api/fetchCrimeRate";
import { fetchForecast } from "./api/fetchForecast";
import { fetchInvestScore } from "./api/fetchInvestScore";
import medianPrices from "./data/medianPrices.json";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [selected, setSelected] = useState(null);

  async function handleNeighborhoodSelect({ name }) {
    const medianPrice = medianPrices[name] || null;

    const crimeRate = await fetchCrimeRate(name);
    const forecast = await fetchForecast(name, medianPrice);
    const investScore = await fetchInvestScore(crimeRate, medianPrice, forecast);

    setSelected({
      name,
      medianPrice,
      crimeRate,
      forecast,
      investScore
    });
  }

  return (
    <div
      className="app-root"
      style={{
        display: "flex",
        height: "100vh",
        background: "#050816",
        color: "#f9fafb",
      }}
    >

      {}
      <div
        className="sidebar"
        style={{
          width: "340px",
          padding: "12px",
          background: "rgba(7, 10, 24, 0.96)",
          borderRight: "1px solid rgba(148, 163, 184, 0.25)",
          height: "100vh",
          overflowY: "auto"
        }}
      >
        <Sidebar region={selected} />
      </div>

      {}
      <div className="map-panel" style={{ flexGrow: 1, position: "relative" }}>
        <div className="map-header">
          <div className="map-title-block">
            <h2>InvestMI - AI-Powered</h2>
            <p>Visualize real-estate predictions with AI.</p>
          </div>
          <div className="map-legend">
            <div className="map-legend-item">
              <span className="legend-dot legend-dot--hover" /> Hover
            </div>
            <div className="map-legend-item">
              <span className="legend-dot legend-dot--active" /> Selected
            </div>
          </div>
        </div>

        <div className="map-shell-outer">
          <MapMichigan onNeighborhoodClick={handleNeighborhoodSelect} />
          <div className="map-glow-overlay" />
        </div>
      </div>
    </div>
  );
}