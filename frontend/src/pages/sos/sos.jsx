"use client";
import api from "@/utils/axiosInstance";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSocket } from "@/app/context/socketProvider";
import ToastContainer from "@/utils/toastContainer";
import { getToken } from "@/utils/tokenHelper";

const SOSPage = () => {
    const { socket, status } = useSocket();
    const [message, setMessage] = useState("");
    const [liveSOSMessages, setLiveSOSMessages] = useState([]);
    const [previousSOSMessages, setPreviousSOSMessages] = useState([]);
    const [loadingPrevious, setLoadingPrevious] = useState(false);
    

    useEffect(() => {
        if (!socket) return;

        socket.on("newSOS", (data) => {
            console.log("Received SOS:", data);
            setLiveSOSMessages((prev) => [data, ...prev]);
            toast.info("New SOS received!");

            // Browser notification when page is not focused
            if (document.visibilityState === "hidden" && Notification.permission === "granted") {
                new Notification("New SOS Alert!", {
                    body: `Emergency Type: ${data.emergency_type}`,
                    icon: "/favicon.ico",
                });
            }

            // Play sound (audio logic stays the same as before)
            const audio = new Audio("/sounds/e1.mp3");
            audio.play();
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, 5000);
        });

        return () => {
            socket.off("newSOS");
        };
    }, [socket]);

    const sendSOS = async () => {
        if (socket && socket.connected) {
            const location = await getUserLocation();
            const sosData = {
                triggered_by: "User1",
                station_id: "Station1",
                location,
                emergency_type: message || "Medical",
            };

            const token = getToken();
            socket.emit("sendSOS", sosData, token);
            toast.success("SOS message sent!");
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
            <p><strong>📍 Location:</strong> {sos?.location?.latitude && sos?.location?.longitude ? (
                <a
                    href={`https://www.google.com/maps?q=${sos.location.latitude},${sos.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                >
                    ({sos.location.latitude}, {sos.location.longitude})
                </a>
            ) : (
                'Location not available'
            )}</p>
            <p><strong>🆘 Emergency Type:</strong> {sos?.emergency_type}</p>
            <p><strong>⏰ Timestamp:</strong> {new Date(sos?.createdAt || sos?.timestamp).toLocaleString()}</p>
        </div>
    );

    return (
        <div className="min-h-screen pt-10 flex flex-col items-center">
            <div className="bg-white rounded-3xl p-10 w-full space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-4">SOS Dashboard</h1>
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
                        Send SOS
                    </button>
                </div>

                <div className="flex justify-center gap-6 mb-8 flex-wrap">
                    <button
                        onClick={fetchPreviousSOS}
                        disabled={loadingPrevious}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
                    >
                        {loadingPrevious ? "Loading..." : "Load Previous SOS"}
                    </button>
                </div>

                <section>
                    <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Live SOS Updates</h2>
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
                    <h2 className="text-3xl font-semibold mb-6 text-center text-green-700"> Previous SOS Messages</h2>
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
