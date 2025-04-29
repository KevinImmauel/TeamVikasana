"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from "@/utils/axiosInstance";

export default function Dashboard() {
  const { user, hasRole, logout } = useAuth();
  const [stats, setStats] = useState({
    activeBeats: 0,
    incidents: 0,
    sosAlerts: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Fetch data from API
    const fetchStats = async () => {
      try {
        const response = await api.get("/stats/counts");
        // if (!response.ok) {
        //   throw new Error("Failed to fetch stats");
        // }
        const data = response.data
        setStats({
          activeBeats: data.beatsCount,
          incidents: data.incidentsCount,
          sosAlerts: data.sosCount,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats({
          ...stats,
          loading: false,
          error: error.message,
        });
      }
    };

    fetchStats();
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
    return "Welcome to the Beat Management System!";
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
      <div className="bg-destructive/10 border border-destructive p-6 rounded-lg">
        <h2 className="text-lg font-medium text-destructive mb-2">Error</h2>
        <p>{stats.error}</p>
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
    <div className="space-y-6 mt-10 py-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">{getWelcomeMessage()}</p>
        </div>

        {/* Quick actions section based on user role */}
        <div className="mt-4 md:mt-0 space-x-2">
          {(hasRole("SuperAdmin") || hasRole("SHO") || hasRole("DSP")) && (
            <Link href="/dashboard/beats" className="btn-primary">
              Assign Beat
            </Link>
          )}

          {hasRole("Constable") && (
            <Link href="/dashboard/report-incident" className="btn-primary">
              Report Incident
            </Link>
          )}

          <Link
            href={hasRole("Constable") ? "/dashboard/sos-trigger" : "/dashboard/sos"}
            className={`${hasRole("Constable") ? "btn-destructive" : "btn-secondary"}`}
          >
            {hasRole("Constable") ? "SOS Emergency" : "View SOS Alerts"}
          </Link>
        </div>
      </div>

      {/* Main metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Beats Card */}
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">Active Beats</h3>
              <p className="text-3xl font-bold mt-2">{stats.activeBeats}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link href={hasRole("Constable") ? "/dashboard/my-beats" : "/dashboard/beats"} className="text-sm text-primary font-medium hover:underline">
              View details →
            </Link>
          </div>
        </div>

        {/* Reported Incidents Card */}
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">Reported Incidents</h3>
              <p className="text-3xl font-bold mt-2">{stats.incidents}</p>
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link href={hasRole("Constable") ? "/dashboard/report-incident" : "/dashboard/incidents"} className="text-sm text-primary font-medium hover:underline">
              {hasRole("Constable") ? "Report new incident" : "View all incidents"} →
            </Link>
          </div>
        </div>

        {/* SOS Alerts Card */}
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">Active SOS Alerts</h3>
              <p className="text-3xl font-bold mt-2">{stats.sosAlerts}</p>
            </div>
            <div className="bg-destructive/10 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link href={hasRole("Constable") ? "/dashboard/sos-trigger" : "/dashboard/sos"} className="text-sm text-primary font-medium hover:underline">
              {hasRole("Constable") ? "Trigger SOS" : "View SOS alerts"} →
            </Link>
          </div>
        </div>
      </div>

      {/* Admin-specific section */}
      {(hasRole("SuperAdmin") || hasRole("SHO") || hasRole("DSP")) && (
        <div className="card">
          <h3 className="text-lg font-medium mb-4">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Total Officers</p>
              <p className="text-2xl font-bold">--</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Beats Coverage</p>
              <p className="text-2xl font-bold">--%</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Average Response Time</p>
              <p className="text-2xl font-bold">--</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Pending Incidents</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Chart */}
      <div className="card mt-8">
        <h3 className="text-lg font-medium">Beat Incidents & SOS Activity</h3>
        <div className="mt-6 w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Active Beats', value: stats.activeBeats },
              { name: 'Reported Incidents', value: stats.incidents },
              { name: 'SOS Alerts', value: stats.sosAlerts }
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
