"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import incidentsService from "../../services/incidents";
import LoadingSpinner from "../../components/LoadingSpinner";
import { containerVariants, itemVariants } from "../../components/PageTransition";

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show" 
      className="space-y-6"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Incident Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage incident reports</p>
        </div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-4 md:mt-0"
        >
          <button className="btn-primary">
            + Report New Incident
          </button>
        </motion.div>
      </motion.div>

      {incidents.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="card py-12"
        >
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No incidents reported</h3>
            <p className="text-muted-foreground">No incidents have been reported yet.</p>
            <button className="btn-primary mt-4">
              Report New Incident
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={itemVariants}
          className="overflow-x-auto"
        >
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
              {/* Map through incidents data with animations */}
              {incidents.map((incident, index) => (
                <motion.tr 
                  key={incident.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border"
                >
                  <td className="p-3">{incident.id}</td>
                  <td className="p-3">{incident.type}</td>
                  <td className="p-3">{incident.location}</td>
                  <td className="p-3">{incident.reportedBy}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${incident.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(incident.reportedOn).toLocaleString()}</td>
                  <td className="p-3">
                    <button className="text-primary hover:underline mr-2">View</button>
                    {(hasRole("SuperAdmin") || hasRole("SHO")) && (
                      <button className="text-primary hover:underline">Update</button>
                    )}
                  </td>
                </motion.tr>
              ))}

              {/* Placeholder data if incidents array is empty */}
              {incidents.length === 0 && (
                <>
                  <motion.tr 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border-b border-border"
                  >
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
                  </motion.tr>
                  <motion.tr 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="border-b border-border"
                  >
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
                  </motion.tr>
                </>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}