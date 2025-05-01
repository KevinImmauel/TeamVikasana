"use client";
import { createContext, useState, useContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const socketConnection = io("https://cyber-acrt.onrender.com/", {
      transports: ["websocket"],
    });

    socketConnection.on("connect", () => {
      setStatus("Connected");
      console.log("Connected to Socket.IO");
    });

    socketConnection.on("newSOS", (data) => {
      console.log("Received SOS:", data);

        if (Notification.permission === "granted") {
            const { triggered_by, station_id, location, emergency_type, createdAt, timestamp } = data;

            // Format the timestamp
            const formattedTimestamp = new Date(createdAt || timestamp).toLocaleString();

            // Location link for Google Maps
            const locationLink = location?.latitude && location?.longitude
                ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
                : null;

            // Notification body text
            const bodyText = `
    🚨 Triggered By: ${triggered_by}
    🏢 Station: ${station_id}
    📍 Location: ${locationLink ? `See on Map: ${locationLink}` : 'Location not available'}
    🆘 Emergency Type: ${emergency_type}
    ⏰ Timestamp: ${formattedTimestamp}
  `;

            // Creating the notification
            new Notification("🚨 New SOS Alert 🚨", {
                body: bodyText,
                icon: "/favicon.ico",
                badge: "/icon-badge.ico",
                renotify: true,
                tag: "sos-alert",
                requireInteraction: true,
            });
        }



      // Play sound
      const audioRef = new Audio("/sounds/e1.mp3");
      audioRef.play();
      setTimeout(() => {
        audioRef.pause();
        audioRef.currentTime = 0;
      }, 5000);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, status }}>
      {children}
    </SocketContext.Provider>
  );
};
