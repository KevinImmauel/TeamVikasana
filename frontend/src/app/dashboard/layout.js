"use client";

import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function DashboardLayout({ children }) {

  const isDark = false
  return (
    <ErrorBoundary>
        <div className={`flex h-screen ${isDark ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top navigation */}
            <Navbar />
            
            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="container mx-auto mt-5 bg-white">
                {children}
              </div>
            </main>
            
            {/* Footer */}
            <footer className={`py-4 px-6 ${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="container mx-auto text-center text-sm opacity-70">
                <p>Team Vikasana - Police Beat Management System</p>
              </div>
            </footer>
          </div>
          
          {/* Toast notifications */}
        </div>

    </ErrorBoundary>
  );
}