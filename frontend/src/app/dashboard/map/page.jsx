"use client";
import React, { useEffect, useState } from 'react';
import AlertMap from '@/components/AlertMap';
import api from '@/utils/axiosInstance';

export default function MapPage() {
  const [alertLocations, setAlertLocations] = useState([]);
  const [crimeHeatLocations, setCrimeHeatLocations] = useState([]);
  const [loc, setLoc] = useState([]);


  useEffect(() => {
    const fetchCrimeLocations = async () => {
      try {
        const response = await api.get('/crime/location/data');
        console.log(response);
        setLoc(response.data)

        if (response.data && response.data) { 
          const alertData = response.data.map(location => ({
            latitude: location.location.latitude,
            longitude: location.location.longitude,
            iconType: location.seriousness === 'HIGH' ? 'critical' : 'warning',
          }));

          const heatData = response.data.map(location => ({
            latitude: location.location.latitude,
            longitude: location.location.longitude,
            radius: location.radius || 300, 
          }));

          // Set the state with the fetched data
          setAlertLocations(alertData);
          setCrimeHeatLocations(heatData);
        }
      } catch (error) {
        console.error('Error fetching crime location data:', error);
      }
    };

    fetchCrimeLocations();
  }, []);

  return (
    <div className="h-screen w-screen">
      <AlertMap
        alertLocations={alertLocations}
        crimeHeatLocations={crimeHeatLocations}
      />
    </div>
  );
}
