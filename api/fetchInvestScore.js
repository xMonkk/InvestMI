export async function fetchInvestScore(crimeRate, currentPrice, forecastPrice) {
  const url = `http://localhost:5000/api/invest-score?crimeRate=${crimeRate}&current=${currentPrice}&forecast=${forecastPrice}`;

  const res = await fetch(url);
  const data = await res.json();
  return data.score;
}
