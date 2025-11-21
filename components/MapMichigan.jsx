import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import neighborhoods from "../data/detroit-neighborhoods.json";
import { useEffect, useRef } from "react";

const baseStyle = {
  color: "#4b5563",
  weight: 1.2,
  fillColor: "#0f172a",
  fillOpacity: 0.3,
};

const hoverStyle = {
  color: "#22d3ee",
  weight: 3,
  fillColor: "#0ea5e9",
  fillOpacity: 0.18,
};

const selectedStyle = {
  color: "#a855f7",
  weight: 4,
  fillColor: "#7c3aed",
  fillOpacity: 0.3,
};

function ZoomToFeature({ feature }) {
  const map = useMap();
  const hasZoomedRef = useRef(null);

  useEffect(() => {
    if (!feature) return;

    hasZoomedRef.current = false;

    const layer = L.geoJSON(feature);
    const bounds = layer.getBounds();
    if (!bounds.isValid()) return;

    if (!hasZoomedRef.current) {
      hasZoomedRef.current = true;

      map.flyToBounds(bounds, {
        padding: [80, 80],
        maxZoom: 14.2,
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [feature, map]);

  return null;
}

export default function MapMichigan({ onNeighborhoodClick }) {
  const [hovered, setHovered] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  function onEachFeature(feature, layer) {
    const name =
      feature.properties.nhood_name ||
      feature.properties.Name ||
      feature.properties.name ||
      "Unknown";

    layer.on({
      mouseover: () => {
        setHovered(name);
        layer.setStyle(hoverStyle);
      },

      mouseout: () => {
        setHovered(null);
        layer.setStyle(
          selectedName === name ? selectedStyle : baseStyle
        );
      },

      click: () => {
        setSelectedName(name);
        setSelectedFeature(feature);

        onNeighborhoodClick({
          name,
          feature
        });

        layer.setStyle(selectedStyle);
      },
    });
  }

  function style(feature) {
    const name =
      feature.properties.nhood_name ||
      feature.properties.Name ||
      feature.properties.name;

    if (name === selectedName) return selectedStyle;
    if (name === hovered) return hoverStyle;
    return baseStyle;
  }

  return (
    <div className="map-shell">
      <MapContainer
        center={[42.35, -83.05]}
        zoom={11}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        className="map-inner"
      >
        <ZoomToFeature feature={selectedFeature} />

        <TileLayer

          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <GeoJSON
          data={neighborhoods}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}