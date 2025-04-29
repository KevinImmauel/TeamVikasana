// src/app/page.jsx
"use client";

import AlertMap from '@/components/AlertMap';

export default function MapPage() {
  const alertLocations = [
    {
      latitude: 12.9716, // Bangalore city center
      longitude: 77.5946,
      iconType: 'critical',
    },
    {
      latitude: 12.9352, // Indiranagar, Bangalore
      longitude: 77.6245,
      iconType: 'warning',
    },
    {
      latitude: 12.9710, // MG Road, Bangalore
      longitude: 77.5945,
      iconType: 'critical',
    },
  ];

  const crimeHeatLocations = [
    { latitude: 12.9720, longitude: 77.5950, radius: 300 },
    { latitude: 12.9380, longitude: 77.6250, radius: 250 },
    { latitude: 12.9735, longitude: 77.5940, radius: 400 },
    { latitude: 12.9725, longitude: 77.5970, radius: 350 },
    { latitude: 12.9700, longitude: 77.5900, radius: 300 },
    { latitude: 12.9690, longitude: 77.5895, radius: 250 },
    // more points can be added here
  ];

  return (
    <div className="h-screen w-screen">
      <AlertMap
        alertLocations={alertLocations}
        crimeHeatLocations={crimeHeatLocations}
      />
    </div>
  );
}
