// src/app/page.jsx
"use client";

import AlertMap from '../../components/AlertMap';

export default function map() {
  const locations = [
    { latitude: 40.7128, longitude: -74.0060, iconType: 'critical' }, // New York City
    { latitude: 40.7484, longitude: -73.9857, iconType: 'warning' }, // Empire State Building
    { latitude: 40.6892, longitude: -74.0445, iconType: 'critical' }, // Statue of Liberty
  ];

  return (
    <div className="h-screen w-screen">
      <AlertMap locations={locations} />
    </div>
  );
}