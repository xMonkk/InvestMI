import React from "react";

export default function Sidebar({ region }) {

  if (!region) {
    return (
      <div className="p-6 text-gray-400">
        <p>Select a neighborhood on the map to view insights.</p>
      </div>
    );
  }

  const { name, medianPrice, crimeRate, forecast, investScore } = region;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ paddingRight: "4px" }}
    >
      <div className="sidebar-header mb-4">
        <div className="sidebar-pill">
          <span className="sidebar-pill-dot" />
          Detroit • Real Estate
        </div>
        <h1 className="sidebar-title">InvestMI</h1>
        <p className="sidebar-subtitle">
          Click a neighborhood on the map to see{" "}
          <span className="accent-text">AI-estimated real estate</span> and{" "}
          <span className="accent-text">investment potential.</span>
        </p>
      </div>

      {/* Card */}
      <div className="sidebar-card mt-2">

        <h2 className="sidebar-location">{name}</h2>

        <div className="metrics-grid">

          {/* Median Price */}
          <div className="metric-pill metric-pill--green">
            <div className="metric-label">Median Price</div>
            <div className="metric-value">
              {medianPrice ? `$${medianPrice.toLocaleString()}` : "N/A"}
            </div>
          </div>

          {/* Crime Rate */}
          <div className="metric-pill metric-pill--red">
            <div className="metric-label">Crime Rate (AI)</div>
            <div className="metric-value">
              {crimeRate ? `${crimeRate}%` : "Loading..."}
            </div>
          </div>

          {/* Forecast */}
          <div className="metric-pill metric-pill--purple">
            <div className="metric-label">5-Year Price Forecast</div>
            <div className="metric-value">
              {forecast === "loading"
                ? "Loading..."
                : forecast
                ? `$${Number(forecast).toLocaleString()}`
                : "N/A"}
            </div>
          </div>

          {/* Investment Score */}
          <div
            className="metric-pill"
            style={{
              background:
                investScore >= 50
                  ? "rgba(34, 197, 94, 0.18)"
                  : investScore >= 25
                  ? "rgba(250, 204, 21, 0.18)"
                  : "rgba(239, 68, 68, 0.18)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="metric-label">AI Investment Score</div>
            <div
              className="metric-value"
              style={{
                color:
                  investScore >= 50
                    ? "#4ade80"
                    : investScore >= 25
                    ? "#facc15"
                    : "#f87171",
                fontWeight: 700,
                fontSize: "1.25rem",
              }}
            >
              {investScore !== null ? `${investScore}/100` : "Loading..."}
            </div>
          </div>
        </div>

        <div className="sidebar-footer mt-4">
          Powered by <span className="accent-soft">IBM watsonx.</span>
        </div>
      </div>
    </div>
  );
}
