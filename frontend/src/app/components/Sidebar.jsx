"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

// Icons
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
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Beats', href: '/dashboard/beats', icon: BeatsIcon },
  { name: 'Incidents', href: '/dashboard/incidents', icon: IncidentsIcon },
  { name: 'SOS', href: '/dashboard/sos', icon: SOSIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: AnalyticsIcon },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isDark } = useTheme();
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (isOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          toggleButton && 
          !toggleButton.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <>
      {/* Mobile sidebar toggle */}
      <button 
        id="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-primary-500 text-white shadow-lg transition-all hover:bg-primary-600"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
      
      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out transform
                   ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                   w-64 lg:sticky lg:top-0 lg:h-screen
                   ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} 
                   shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-opacity-20 flex items-center justify-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
                <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z" />
              </svg>
              <span className="text-xl font-bold">Beat System</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-grow py-4 px-2 overflow-y-auto">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                                ${isActive 
                                  ? 'bg-primary-500 text-white' 
                                  : `hover:bg-opacity-10 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-900'}`
                                }`}
                    >
                      <span className="flex-shrink-0">
                        <item.icon />
                      </span>
                      <span>{item.name}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-sm text-center opacity-70">
              <p>Beat Management System</p>
              <p>© 2025 Team Vikasana</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}