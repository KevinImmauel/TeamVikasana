import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import AppErrorBoundary from "./components/ErrorBoundary";
import "./globals.css";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            <AppErrorBoundary>
              {children}
            </AppErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
