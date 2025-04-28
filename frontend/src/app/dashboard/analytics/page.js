"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useAuth } from "../../context/AuthContext";
import incidentsService from "../../services/incidents";
import beatsService from "../../services/beats";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AnalyticsPage() {
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incidentsByBeat, setIncidentsByBeat] = useState([]);
  const [incidentsByType, setIncidentsByType] = useState([]);

  // Colors for pie chart that work in both light & dark modes
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setLoading(true);
        
        // Fetch incidents & beats data
        const [incidentsData, beatsData] = await Promise.all([
          incidentsService.getAllIncidents(),
          beatsService.getAllBeats()
        ]);
        
        // Process data for incidents by beat
        const beatIncidents = processIncidentsByBeat(incidentsData, beatsData);
        setIncidentsByBeat(beatIncidents);
        
        // Process data for incidents by type
        const typeIncidents = processIncidentsByType(incidentsData);
        setIncidentsByType(typeIncidents);
        
        setError(null);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnalyticsData();
  }, []);

  // Process incidents by beat for the bar chart
  const processIncidentsByBeat = (incidents = [], beats = []) => {
    // Since we don't have actual data, we'll create sample data
    // In a real app, you would process the actual incidents & beats data
    
    // Mock data for demo - replace with real data processing
    return [
      { name: 'Beat-001', incidents: 65 },
      { name: 'Beat-002', incidents: 42 },
      { name: 'Beat-003', incidents: 73 },
      { name: 'Beat-004', incidents: 29 },
      { name: 'Beat-005', incidents: 51 },
      { name: 'Beat-006', incidents: 37 },
    ];
  };
  
  // Process incidents by type for the pie chart
  const processIncidentsByType = (incidents = []) => {
    // Mock data for demo - replace with real data processing
    return [
      { name: 'Theft', value: 35 },
      { name: 'Assault', value: 20 },
      { name: 'Burglary', value: 15 },
      { name: 'Disturbance', value: 25 },
      { name: 'Traffic', value: 18 },
      { name: 'Other', value: 12 },
    ];
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-primary">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading analytics data..." />
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
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Crime Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visual insights into crime patterns and beat performance
        </p>
      </div>
      
      {/* Date range selector (placeholder) */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium">Time period:</span>
          <select className="input">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 12 months</option>
            <option>Custom range</option>
          </select>
          <span className="text-sm text-muted-foreground ml-auto">
            Data updated: Apr 28, 2025
          </span>
        </div>
      </div>
      
      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart card */}
        <div className="card p-4">
          <h2 className="text-lg font-medium mb-4">Incidents per Beat</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incidentsByBeat}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--foreground)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  tick={{ fill: 'var(--foreground)' }} 
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                <Bar dataKey="incidents" fill="var(--primary)" name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie chart card */}
        <div className="card p-4">
          <h2 className="text-lg font-medium mb-4">Incidents by Type</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {incidentsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend formatter={(value, entry) => <span className="text-foreground">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Additional stats cards */}
        <div className="card p-4">
          <h2 className="text-lg font-medium mb-4">Response Time Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              <p className="text-2xl font-bold">8.5 min</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Fastest Beat</p>
              <p className="text-2xl font-bold">Beat-003</p>
              <p className="text-xs text-muted-foreground">6.2 min avg</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Slowest Beat</p>
              <p className="text-2xl font-bold">Beat-005</p>
              <p className="text-xs text-muted-foreground">12.4 min avg</p>
            </div>
          </div>
        </div>
        
        {/* Crime trends card */}
        <div className="card p-4">
          <h2 className="text-lg font-medium mb-4">Crime Trend Insights</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block p-1 bg-green-100 text-green-800 rounded mr-3">↓</span>
              <span>Theft incidents have decreased by 12% in Beat-002 since last month</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block p-1 bg-red-100 text-red-800 rounded mr-3">↑</span>
              <span>Assaults have increased by 8% in Beat-001 and Beat-006</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block p-1 bg-amber-100 text-amber-800 rounded mr-3">⚠</span>
              <span>Beat-004 shows emerging pattern of nighttime disturbances</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block p-1 bg-blue-100 text-blue-800 rounded mr-3">ℹ</span>
              <span>Traffic incidents are most common on Fridays between 4-6 PM</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}