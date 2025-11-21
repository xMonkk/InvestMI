// src/api/fetchCrimeRate.js

export async function fetchCrimeRate(neighborhood) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/crime-rate?neighborhood=${encodeURIComponent(
                neighborhood
            )}`
        );

        if (!response.ok) {
            console.error("Crime Rate API Error:", await response.text());
            return "N/A";
        }

        const data = await response.json();
        return data.crimeRate || "N/A";

    } catch (err) {
        console.error("Crime Rate Fetch Error:", err);
        return "N/A";
    }
}
