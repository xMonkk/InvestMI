// compute-medians.mjs
import fs from "fs";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

// Paths
const NEIGHBORHOODS_PATH = "./src/data/detroit-neighborhoods.json";
const SALES_PATH = "./public/detroit-sales.json";
const OUTPUT_PATH = "./public/median-prices.json";

console.log("Loading neighborhoods...");
const neighborhoods = JSON.parse(fs.readFileSync(NEIGHBORHOODS_PATH, "utf8"));

console.log("Loading sales...");
const sales = JSON.parse(fs.readFileSync(SALES_PATH, "utf8"));

const buckets = {};
let processed = 0;

console.log("Processing...");

for (const s of sales.features) {
  processed++;
  if (processed % 50000 === 0) console.log("Processed:", processed);

  const p = s.properties;
  if (!p) continue;

  // 1 — RESIDENTIAL ONLY
  const desc = p.property_class_description || "";
  if (!desc.toUpperCase().includes("RESIDENTIAL")) continue;

  // 2 — VALID sale price
  const price = p.amt_sale_price;
  if (!price || price < 500 || price > 5000000) continue;

  // 3 — REMOVE non-arm-length transfer types
  const instr = (p.sale_instrument || "").toUpperCase();
  if (["QC", "QUIT CLAIM", "SHERIFF", "PTA"].some(bad => instr.includes(bad)))
    continue;

  // 4 — Valid coordinates
  let lat = p.latitude;
  let lng = p.longitude;

  if (s.geometry?.type === "Point") {
    const [geoLng, geoLat] = s.geometry.coordinates;
    lng = geoLng;
    lat = geoLat;
  }

  if (!lat || !lng) continue;

  const point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  // 5 — Assign to neighborhood
  for (const nh of neighborhoods.features) {
    if (!nh.geometry) continue;

    const inside = booleanPointInPolygon(point, nh);
    if (!inside) continue;

    const name = nh.properties.nhood_name || "Unknown";
    if (!buckets[name]) buckets[name] = [];

    buckets[name].push(price);
    break;
  }
}

console.log("Computing medians...");

const medians = {};
for (const n in buckets) {
  const arr = buckets[n].sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);

  medians[n] =
    arr.length % 2 === 0
      ? (arr[mid - 1] + arr[mid]) / 2
      : arr[mid];
}

console.log("Saving output...");
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(medians, null, 2));

console.log("DONE. Output saved at:", OUTPUT_PATH);
