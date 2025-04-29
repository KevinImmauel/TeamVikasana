"use client";

import React, { useEffect, useRef } from "react";

const AlertMap = ({ alertLocations = [], crimeHeatLocations = [] }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current) {
        const defaultCenter =
          alertLocations.length > 0
            ? [alertLocations[0].latitude, alertLocations[0].longitude]
            : [40.7128, -74.006];

        const map = L.map(mapContainerRef.current).setView(defaultCenter, 13);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // ---- Define alert icons
        const criticalIcon = L.divIcon({
          className: "critical-icon",
          html: `<div class="text-red-600 text-3xl">⚠️</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const warningIcon = L.divIcon({
          className: "warning-icon",
          html: `<div class="text-yellow-500 text-3xl">⚠️</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        // ---- Add alert markers
        alertLocations.forEach((location) => {
          const icon =
            location.iconType === "critical" ? criticalIcon : warningIcon;
          L.marker([location.latitude, location.longitude], { icon })
            .addTo(map)
            .bindPopup(
              `${location.iconType.charAt(0).toUpperCase() + location.iconType.slice(1)} Alert`
            );
        });

        // ---- Add crime density circles separately
        crimeHeatLocations.forEach((crime) => {
          const circle = L.circle([crime.latitude, crime.longitude], {
            color: "red",
            fillColor: "red",
            fillOpacity: 0.2,
            radius: crime.radius || 200, // Default 200 meters
            weight: 1,
          });
          circle.addTo(map);
        });

        // ---- Fit bounds
        if (alertLocations.length > 0) {
          const bounds = L.latLngBounds(
            alertLocations.map((loc) => [loc.latitude, loc.longitude])
          );
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    };

    loadMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [alertLocations, crimeHeatLocations]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default AlertMap;
