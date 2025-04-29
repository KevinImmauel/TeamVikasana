"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import beatsService from "../services/beats";
import incidentsService from "../services/incidents";
import sosService from "../services/sos";
import LoadingSpinner from "../components/LoadingSpinner";
import { containerVariants, itemVariants } from "../components/PageTransition";

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    activeBeats: 0,
    incidents: 0,
    sosAlerts: 0,
    recentIncidents: [],
    activeOfficers: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch data based on user role
        const promises = [];
        
        // All roles need active beats count
        promises.push(beatsService.getActiveBeats());
        
        // All roles need recent incidents
        promises.push(incidentsService.getRecentIncidents(5));
        
        // All roles need active SOS alerts
        promises.push(sosService.getActiveAlerts());

        const [beatsData, incidentsData, sosData] = await Promise.all(promises);

        setStats({
          activeBeats: beatsData.length || 0,
          incidents: incidentsData.length || 0,
          recentIncidents: incidentsData || [],
          sosAlerts: sosData.length || 0,
          activeOfficers: 12, // Mock data
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats({
          ...stats,
          loading: false,
          error: "Failed to load dashboard data"
        });
      }
    }

    fetchDashboardData();
  }, []);

  // Role-specific welcome message
  const getWelcomeMessage = () => {
    if (hasRole("SuperAdmin")) {
      return "Welcome, Admin! Here's an overview of the system.";
    } else if (hasRole("SHO")) {
      return "Welcome, Station House Officer! Here's your station's status.";
    } else if (hasRole("DSP")) {
      return "Welcome, Deputy Superintendent! Here's your district's status.";
    } else if (hasRole("Constable")) {
      return "Welcome, Officer! Here's your beat information.";
    }
    return "Welcome to the Police Department Dashboard!";
  };

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading dashboard data..." />
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
        <h2 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">Error</h2>
        <p className="text-red-600 dark:text-red-300">{stats.error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-amber-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header with welcome message */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">{getWelcomeMessage()}</p>
        </div>
        
        {/* Quick actions section based on user role */}
        <div className="flex flex-wrap gap-3">
          {(hasRole("SuperAdmin") || hasRole("SHO") || hasRole("DSP")) && (
            <Link href="/dashboard/beats" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 text-sm font-medium">
              Assign Beat
            </Link>
          )}
          
          {hasRole("Constable") && (
            <Link href="/dashboard/report-incident" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 text-sm font-medium">
              Report Incident
            </Link>
          )}
          
          <Link 
            href={hasRole("Constable") ? "/dashboard/sos-trigger" : "/dashboard/sos"} 
            className={`px-4 py-2 ${hasRole("Constable") ? "bg-red-600 hover:bg-red-700 shadow-red-500/20 hover:shadow-red-500/30" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 hover:shadow-blue-500/30"} text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-sm font-medium`}
          >
            {hasRole("Constable") ? "SOS Emergency" : "View SOS Alerts"}
          </Link>
        </div>
      </motion.div>

      {/* Main stats cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Active Beats Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-dark-500 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Beats</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeBeats}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/dashboard/beats" className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
        </motion.div>
        
        {/* Incidents Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-dark-500 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reported Incidents</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.incidents}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/dashboard/incidents" className="text-sm text-amber-600 dark:text-amber-400 font-medium flex items-center hover:underline">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
        </motion.div>
        
        {/* SOS Alerts Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-dark-500 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active SOS Alerts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.sosAlerts}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/dashboard/sos" className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center hover:underline">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600"></div>
        </motion.div>
        
        {/* Active Officers Widget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-dark-500 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Officers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeOfficers}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/dashboard/officers" className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center hover:underline">
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
        </motion.div>
      </motion.div>

      {/* Recent incidents list */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-dark-500 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Incidents</h2>
          <Link href="/dashboard/incidents" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentIncidents.length > 0 ? (
                stats.recentIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{incident.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{incident.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{incident.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(incident.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${incident.status === 'Open' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : incident.status === 'In Progress' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center">
                        <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusColor(incident.priority)}`}></span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">{incident.priority}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent incidents to show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom widgets grid - visible for supervisors */}
      {(hasRole("SuperAdmin") || hasRole("SHO") || hasRole("DSP")) && (
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* System overview widget */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-dark-500 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-dark-400 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Beat Coverage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-400 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Response Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8.5 min</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-400 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">System Status</p>
                <p className="text-2xl font-bold text-green-500">Active</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-400 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Shifts Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3/3</p>
              </div>
            </div>
          </motion.div>
          
          {/* Activity timeline */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-dark-500 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-dark-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Officer Singh started beat patrol</p>
                          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">12 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center ring-8 ring-white dark:ring-dark-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">New incident reported at Sector 5</p>
                          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">45 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative">
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white dark:ring-dark-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Shift schedule updated for next week</p>
                          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-6 text-center">
              <Link href="/dashboard/activity" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                View all activity →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Officer-specific section */}
      {hasRole("Constable") && (
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-dark-500 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Beat Status</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-dark-400 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 relative">
                <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-green-500 opacity-75 animate-ping"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Current Assignment</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Beat #12345 - Downtown Area</p>
              </div>
              <div className="ml-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400">Until 8:00 PM</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-dark-400 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-2">Recent Activity</p>
              <div className="text-sm space-y-2">
                <p className="text-gray-500 dark:text-gray-400">Patrol started at 12:00 PM</p>
                <p className="text-gray-500 dark:text-gray-400">Checkpoint #3 reached at 1:15 PM</p>
                <p className="text-gray-500 dark:text-gray-400">Check-in at Station at 3:30 PM</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/dashboard/report-incident" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 text-sm font-medium">
                Report Incident
              </Link>
              <Link href="/dashboard/sos-trigger" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md shadow-red-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30 text-sm font-medium">
                SOS Emergency
              </Link>
              <Link href="/dashboard/my-beats" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm transition-all duration-200 text-sm font-medium">
                View Beat Details
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}