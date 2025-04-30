"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import api from "@/utils/axiosInstance";

export default function AnalyticsPage() {
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incidentsByBeat, setIncidentsByBeat] = useState([]);
  const [incidentsByType, setIncidentsByType] = useState([]);
  const [crimeTrends, setCrimeTrends] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);



  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const formatText = (text) => {
    return { __html: text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') };
  };

  useEffect(() => {
    const cached = localStorage.getItem("analytics-data");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setIncidentsByBeat(parsed.incidentsByBeat || []);
        setIncidentsByType(parsed.incidentsByType || []);
        setCrimeTrends(parsed.crimeTrends || []);
        setLastUpdated(parsed.lastUpdated || null);
        setHasFetched(true);
        setLoading(false);
      } catch (err) {
        console.error("Error parsing cached analytics data:", err);
        handleRefresh(); // fallback to fresh fetch if parsing fails
      }
    } else {
      handleRefresh(); // fetch if nothing in localStorage
    }
  }, []);




  const handleRefresh = async () => {
    try {
      setLoading(true);
      const beatRes = await api.get('/crime/analysis/station');
      const stationRes = await api.get('/crime/analysis');
      const trendsRes = await api.get('/crime-trends');

      const beatsData = [
        { id: 'STN001', name: 'Beat-001' },
        { id: 'STN002', name: 'Beat-002' },
        { id: 'STN003', name: 'Beat-003' },
        { id: 'STN004', name: 'Beat-004' },
        { id: 'STN005', name: 'Beat-005' },
        { id: 'STN006', name: 'Beat-006' },
        { id: 'STN007', name: 'Beat-007' },
      ];

      const beatIncidents = processIncidentsByBeat(beatRes.data, beatsData);
      const typeIncidents = processIncidentsByType(stationRes.data);
      const trendData = trendsRes.data || [];
      const updatedAt = new Date().toISOString();
      setIncidentsByBeat(beatIncidents);
      setIncidentsByType(typeIncidents);
      setCrimeTrends(trendData);
      setError(null);
      setHasFetched(true);
      setLastUpdated(updatedAt);
      localStorage.setItem("analytics-data", JSON.stringify({
        incidentsByBeat: beatIncidents,
        incidentsByType: typeIncidents,
        crimeTrends: trendData,
        lastUpdated: updatedAt,
      }));
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };







  const processIncidentsByBeat = (apiData = [], beats = []) => {
    return beats.map(beat => {
      const beatData = apiData.find(entry => entry.station_id === beat.id);
      const totalIncidents = beatData
        ? beatData.incidents.reduce((sum, inc) => sum + inc.count, 0)
        : 0;
      return {
        name: beat.name,
        incidents: totalIncidents
      };
    });
  };



  const processIncidentsByType = (data = []) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return data.map(item => ({
      name: item.incident_type || 'null',
      value: Number(((item.count / total) * 100).toFixed(2)),
    }));
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
    <div className="space-y-6 mt-10">
      {/*       <div className="card p-4 flex justify-between items-center">

        
      </div>
 */}
      <div>
        <h1 className="text-2xl font-bold">Crime Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visual insights into crime patterns and beat performance
        </p>
      </div>
      <div className="card p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/*  <span className="text-sm font-medium">Time period:</span>
          <select className="input">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 12 months</option>
            <option>Custom range</option>
          </select> */}
          <button onClick={handleRefresh} className="btn-primary">
            🔄 Refresh Data
          </button>
          <span className="text-sm text-muted-foreground ml-auto">
            {lastUpdated ? `Data updated: ${new Date(lastUpdated).toLocaleString()}` : "No recent update"}
          </span>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="card p-4 rounded-2xl border border-gray-200 shadow-sm max-h-[400px] overflow-y-auto hover:scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-100 transition-all duration-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Crime Trend Insights</h2>
          <div
            className="prose prose-sm text-gray-700 leading-relaxed space-y-3"
            dangerouslySetInnerHTML={formatText(crimeTrends.reply)}
          />
        </div>

      </div>

    </div>
  );
}