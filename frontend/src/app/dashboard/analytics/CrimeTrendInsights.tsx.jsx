"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

export default function CrimeTrendInsights() {
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState(null);
    const [error, setError] = useState(null);

    const formatText = (text) => {
        return { __html: text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') };
    };

    useEffect(() => {
        async function fetchTrends() {
            try {
                const res = await api.get("/crime-trends");
                setTrendData(res.data || {});
                setError(null);
            } catch (err) {
                console.error("Error loading crime trend insights:", err);
                setError("Failed to load crime trend insights.");
            } finally {
                setLoading(false);
            }
        }

        fetchTrends();
    }, []);

    if (loading) {
        return (
            <div className="p-4 text-sm text-muted-foreground">
                Loading crime trend insights...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-sm text-red-600 bg-red-100 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="card p-4 rounded-2xl border border-gray-200 shadow-sm max-h-[400px] overflow-y-auto hover:scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-100 transition-all duration-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Crime Trend Insights</h2>
            <div
                className="prose prose-sm text-gray-700 leading-relaxed space-y-3"
                dangerouslySetInnerHTML={formatText(trendData.reply)}
            />
        </div>
    );
}
