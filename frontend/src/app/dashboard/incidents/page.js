"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function IncidentsManagement() {
  const { hasRole } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        setLoading(true);
        const data = await incidentsService.getAllIncidents();
        setIncidents(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching incidents:", error);
        setError("Failed to load incidents data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading incidents data..." />
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
          <h1 className="text-2xl font-bold">Incident Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage incident reports</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button className="btn-primary">
            + Report New Incident
          </button>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="card py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No incidents reported</h3>
            <p className="text-muted-foreground">No incidents have been reported yet.</p>
            <button className="btn-primary mt-4">
              Report New Incident
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Reported By</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Reported On</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder data - would be replaced with actual incidents data */}
              <tr className="border-b border-border">
                <td className="p-3">INC-1234</td>
                <td className="p-3">Theft</td>
                <td className="p-3">Main Street Market</td>
                <td className="p-3">Officer J. Smith</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">In Progress</span>
                </td>
                <td className="p-3">Apr 28, 2025, 09:45 AM</td>
                <td className="p-3">
                  <button className="text-primary hover:underline mr-2">View</button>
                  {(hasRole("SuperAdmin") || hasRole("SHO")) && (
                    <button className="text-primary hover:underline">Update</button>
                  )}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3">INC-1233</td>
                <td className="p-3">Disturbance</td>
                <td className="p-3">Central Park</td>
                <td className="p-3">Officer M. Johnson</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Resolved</span>
                </td>
                <td className="p-3">Apr 27, 2025, 07:30 PM</td>
                <td className="p-3">
                  <button className="text-primary hover:underline mr-2">View</button>
                  {(hasRole("SuperAdmin") || hasRole("SHO")) && (
                    <button className="text-primary hover:underline">Update</button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}