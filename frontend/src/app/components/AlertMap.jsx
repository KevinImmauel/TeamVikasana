"use client";

import React, { useEffect, useRef } from 'react';

const AlertMap = ({ locations }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      if (!mapRef.current) {
        // Initialize map with a default center (first location or fallback)
        const defaultCenter = locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : [40.7128, -74.0060];
        mapRef.current = L.map(mapContainerRef.current).setView(defaultCenter, 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
          .on('tileerror', (error) => {
            console.error('Tile loading error:', error);
          })
          .addTo(mapRef.current);

        // Define two alert icons
        const criticalIcon = L.divIcon({
          className: 'critical-icon',
          html: `<div class="text-red-600 text-3xl">⚠️</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const warningIcon = L.divIcon({
          className: 'warning-icon',
          html: `<div class="text-yellow-500 text-3xl">⚠️</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        // Add markers for each location
        locations.forEach((location) => {
          const icon = location.iconType === 'critical' ? criticalIcon : warningIcon;
          L.marker([location.latitude, location.longitude], { icon })
            .addTo(mapRef.current)
            .bindPopup(`${location.iconType.charAt(0).toUpperCase() + location.iconType.slice(1)} Alert`);
        });

        // Auto-fit bounds to show all markers
        if (locations.length > 0) {
          const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }

        // Refresh map size after initialization
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 100);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full"
    ></div>
  );
};

export default AlertMap;