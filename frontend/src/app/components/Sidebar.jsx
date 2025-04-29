"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

// Icons for navigation
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const BeatsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const IncidentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const SOSIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const OfficersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Beats', href: '/dashboard/beats', icon: BeatsIcon },
  { name: 'Incidents', href: '/dashboard/incidents', icon: IncidentsIcon },
  { name: 'SOS Alerts', href: '/dashboard/sos', icon: SOSIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: AnalyticsIcon },
  { name: 'Officers', href: '/dashboard/officers', icon: OfficersIcon, divider: true },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isDark } = useTheme();
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (isMobileOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          toggleButton && 
          !toggleButton.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);
  
  return (
    <>
      {/* Mobile sidebar toggle */}
      <button 
        id="sidebar-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700"
        aria-label="Toggle sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out transform
                   ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                   ${isCollapsed ? 'w-20' : 'w-64'} lg:sticky lg:top-0
                   bg-white dark:bg-dark-500 border-r border-gray-200 dark:border-gray-700 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/30`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-4 border-b border-gray-200 dark:border-gray-700 flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold">PD</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Police Department</span>
              </Link>
            )}
            
            {isCollapsed && (
              <Link href="/dashboard">
                <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold">PD</span>
                </div>
              </Link>
            )}
            
            {/* Collapse button - desktop only */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden lg:block p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-grow py-5 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <li key={item.name} className={item.divider ? "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700" : ""}>
                    <Link
                      href={item.href}
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-all duration-200
                                ${isActive 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' 
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                          <item.icon />
                        </span>
                        {!isCollapsed && <span>{item.name}</span>}
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && !isCollapsed && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Status Indicator */}
          <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <div className="absolute top-0 left-0 h-3 w-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">System Online</div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <div className="absolute top-0 left-0 h-3 w-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}