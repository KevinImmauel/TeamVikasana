"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from "../app/context/AuthContext";

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

const ChatBotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8C3 4.68629 5.68629 2 9 2C12.3137 2 15 4.68629 15 8C15 9.61314 14.0536 11.0156 12.9326 11.9311C12.3582 12.4289 11.5005 12.6905 10.607 12.6905C9.71347 12.6905 8.85568 12.4289 8.28134 11.9311C7.16033 11.0156 6.214 9.61314 6.214 8C6.214 7.34917 6.46335 6.72129 6.89868 6.27868C7.30784 5.89072 7.80216 5.7468 8.269 5.95768C8.70595 6.15134 9 6.59844 9 7.066V8C9 8.53043 9.21029 9.03914 9.58579 9.41421C10.5876 10.416 12 11 13 11C13.4183 11 13.8169 10.8348 14.1505 10.5305C14.8423 9.82648 15 8.92603 15 8C15 4.68629 12.3137 2 9 2C5.68629 2 3 4.68629 3 8Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8L9 12L3 8" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3L12 8L21 3V21L12 16L3 21V3Z" />
  </svg>
);



const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Beats', href: '/dashboard/beats', icon: BeatsIcon },
  { name: 'Incidents', href: '/dashboard/incidents', icon: IncidentsIcon },
  { name: 'SOS', href: '/dashboard/sos', icon: SOSIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: AnalyticsIcon },
  { name: 'AI Chat Bot', href: '/dashboard/chat', icon: ChatBotIcon },
  { name: 'Maps', href: '/dashboard/map', icon: MapIcon },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isDark } = false;
    const { user, hasRole, logout } = useAuth();
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
                const isActive = pathname === item.href;

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

          {/* Logout Button */}
          <div className="px-4 py-3">
            <button
              onClick={() => {
                // TODO: Handle actual logout logic (e.g., clear auth tokens, redirect)
                logout();
                console.log('Logging out...');
              }}
              className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              <span>Logout</span>
            </button>
          </div>

          
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