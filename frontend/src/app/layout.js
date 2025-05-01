import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import AppErrorBoundary from "../components/ErrorBoundary";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SocketProvider } from "../app/context/socketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Beat Management System",
  description: "Centralized Beat Management System for Police Departments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocketProvider>  {/* Wrap the entire layout with the SocketProvider */}
          <AuthProvider>
            <AppErrorBoundary>
              <Navbar />
              {children}
            </AppErrorBoundary>
          </AuthProvider>
        </SocketProvider>  {/* Close the SocketProvider correctly */}
      </body>
    </html>
  );
}
