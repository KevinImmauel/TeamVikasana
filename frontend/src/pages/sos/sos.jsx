"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import ToastContainer from "@/utils/toastContainer";
import api from "@/utils/axiosInstance";
import { getToken } from "@/utils/tokenHelper";

const SOSPage = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("Disconnected");
    const [liveSOSMessages, setLiveSOSMessages] = useState([]);
    const [previousSOSMessages, setPreviousSOSMessages] = useState([]);
    const [loadingPrevious, setLoadingPrevious] = useState(false);
    const [isSoundPlaying, setIsSoundPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const socketConnection = io("http://localhost:9090", {
            transports: ["websocket"],
        });

        socketConnection.on("connect", () => {
            setStatus("Connected");
            console.log("Connected to Socket.IO");
        });

        socketConnection.on("newSOS", (data) => {
            console.log("Received SOS:", data);
            setLiveSOSMessages((prev) => [data, ...prev]);
            toast.info("🚨 New SOS received!");

            if (audioRef.current) {
                audioRef.current.play();
                setIsSoundPlaying(true);

                setTimeout(() => {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    setIsSoundPlaying(false);
                }, 5000);
            }
        });

        setSocket(socketConnection);

        return () => {
            socketConnection.disconnect();
        };
    }, []);

    const stopSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsSoundPlaying(false);
        }
    };

    const sendSOS = () => {
        if (socket && socket.connected) {
            const sosData = {
                triggered_by: "User1",
                station_id: "Station1",
                location: {
                    latitude: 12.9716,
                    longitude: 77.5946,
                },
                emergency_type: message || "Medical",
            };

            const token = getToken();
            socket.emit("sendSOS", sosData, token);
            toast.success("✅ SOS message sent!");
        } else {
            toast.error("❌ Socket connection lost. Please try again.");
        }
    };

    const fetchPreviousSOS = async () => {
        try {
            setLoadingPrevious(true);
            const response = await api.get("/sos/get/data/");
            setPreviousSOSMessages(response.data.sos || []);
        } catch (error) {
            console.error("Error fetching previous SOS:", error);
            toast.error("Failed to fetch previous SOS messages.");
        } finally {
            setLoadingPrevious(false);
        }
    };

    const MessageCard = ({ sos }) => (
        <div className="p-4 border rounded-xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300">
            <p><strong>🚨 Triggered By:</strong> {sos?.triggered_by}</p>
            <p><strong>🏢 Station:</strong> {sos?.station_id}</p>
            <p><strong>📍 Location:</strong> ({sos?.location?.latitude}, {sos?.location?.longitude})</p>
            <p><strong>🆘 Emergency Type:</strong> {sos?.emergency_type}</p>
            <p><strong>⏰ Timestamp:</strong> {new Date(sos?.createdAt || sos?.timestamp).toLocaleString()}</p>
        </div>
    );

    return (
        <div className="min-h-screen pt-10 flex flex-col items-center">
            <audio ref={audioRef} src="/sounds/e1.mp3" preload="auto" />

            <div className="bg-white rounded-3xl  p-10  w-full space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-4">🚨 SOS Dashboard</h1>

                <p className="text-center text-lg text-gray-700 mb-6">
                    Connection Status: <span className={`font-semibold ${status === "Connected" ? "text-green-600" : "text-red-600"}`}>{status}</span>
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter emergency type (e.g., Medical, Fire)"
                        className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={sendSOS}
                        className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                    >
                        🚀 Send SOS
                    </button>
                </div>

                <div className="flex justify-center gap-6 mb-8 flex-wrap">
                    <button
                        onClick={fetchPreviousSOS}
                        disabled={loadingPrevious}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
                    >
                        {loadingPrevious ? "Loading..." : "📜 Load Previous SOS"}
                    </button>

                    {isSoundPlaying && (
                        <button
                            onClick={stopSound}
                            className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                        >
                            🔇 Stop Sound
                        </button>
                    )}
                </div>

                <section>
                    <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">⚡ Live SOS Updates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {liveSOSMessages.length === 0 ? (
                            <p className="text-center text-gray-500 col-span-2">No live SOS received yet.</p>
                        ) : (
                            liveSOSMessages.map((sos, index) => (
                                <MessageCard key={`live-${index}`} sos={sos} />
                            ))
                        )}
                    </div>
                </section>

                <section className="pt-10">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">📜 Previous SOS Messages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {previousSOSMessages.length === 0 ? (
                            <p className="text-center text-gray-500 col-span-2">No previous SOS messages found.</p>
                        ) : (
                            previousSOSMessages.map((sos, index) => (
                                <MessageCard key={`prev-${index}`} sos={sos} />
                            ))
                        )}
                    </div>
                </section>
            </div>

            <ToastContainer />
        </div>
    );
};

export default SOSPage;
