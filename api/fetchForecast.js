export async function fetchForecast(name, median) {
  const res = await fetch(
    `http://localhost:5000/api/forecast?neighborhood=${encodeURIComponent(
      name
    )}&median=${median || 70000}`
  );

  const data = await res.json();
  return data.forecast || "0";
}
