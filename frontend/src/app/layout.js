import { Geist, Geist_Mono } from "next/font/google";
import { Roboto } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppErrorBoundary from "./components/ErrorBoundary";
import FloatingThemeToggle from "./components/FloatingThemeToggle";
import CustomCursor from "./components/CustomCursor";
import DynamicBackground from "./components/DynamicBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
});

export const metadata = {
  title: "Police Department Dashboard",
  description: "Centralized Beat Management System for Police Departments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {
            console.error('Theme initialization error:', e);
          }
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased h-full text-gray-800 dark:text-gray-200 transition-colors duration-200`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <AppErrorBoundary>
                <DynamicBackground />
                <FloatingThemeToggle />
                {children}
                <CustomCursor />
              </AppErrorBoundary>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
