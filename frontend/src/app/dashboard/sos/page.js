"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import sosService from "../../services/sos";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function SOSAlertsManagement() {
  const { hasRole } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true);
        const data = await sosService.getActiveAlerts();
        setAlerts(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching SOS alerts:", error);
        setError("Failed to load SOS alerts. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading SOS alerts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive p-6 rounded-lg">
        <h2 className="text-lg font-medium text-destructive mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 btn-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">SOS Emergency Alerts</h1>
          <p className="text-muted-foreground mt-1">Active emergency alerts requiring immediate response</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-muted-foreground">Auto-updating every 30 seconds</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="card py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No active SOS alerts</h3>
            <p className="text-muted-foreground">There are no active emergency alerts at this time.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Placeholder data - would be replaced with actual SOS alerts */}
          <div className="card border-l-4 border-l-red-500 bg-destructive/5">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-destructive">URGENT SOS</h3>
              <span className="text-xs bg-destructive text-white px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="mt-3 space-y-2">
              <p><span className="font-medium">Officer:</span> J. Smith (ID: 12345)</p>
              <p><span className="font-medium">Location:</span> Main St & 5th Ave</p>
              <p><span className="font-medium">Time:</span> 15:30, Apr 28, 2025 (10 min ago)</p>
              <p><span className="font-medium">Details:</span> Officer requesting immediate backup</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="btn-primary flex-1">View on Map</button>
              <button className="btn-destructive flex-1">Respond</button>
            </div>
          </div>
          
          <div className="card border-l-4 border-l-red-500 bg-destructive/5">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-destructive">URGENT SOS</h3>
              <span className="text-xs bg-destructive text-white px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="mt-3 space-y-2">
              <p><span className="font-medium">Officer:</span> M. Johnson (ID: 67890)</p>
              <p><span className="font-medium">Location:</span> Central Park, North Entrance</p>
              <p><span className="font-medium">Time:</span> 15:25, Apr 28, 2025 (15 min ago)</p>
              <p><span className="font-medium">Details:</span> Officer in distress, medical assistance required</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="btn-primary flex-1">View on Map</button>
              <button className="btn-destructive flex-1">Respond</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}