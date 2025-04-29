"use client";

import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import ErrorBoundary from '../components/ErrorBoundary';

export default function DashboardLayout({ children }) {
  const { isDark } = useTheme();

  // Add class to body based on theme
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-dark-400 transition-colors duration-300">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            {/* Top navigation */}
            <Navbar />
            
            {/* Page content with transitions */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-dark-400 transition-colors duration-300">
              <div className="max-w-7xl mx-auto">
                <PageTransition>
                  {children}
                </PageTransition>
              </div>
            </main>
            
            {/* Footer */}
            <footer className="bg-white dark:bg-dark-500 border-t border-gray-200 dark:border-gray-700 py-4 px-6 transition-colors duration-300">
              <div className="max-w-7xl mx-auto text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Police Department Dashboard — Team Vikasana © {new Date().getFullYear()}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}