"use client";

import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Function to show theme debugging info
  const showDebugInfo = () => {
    try {
      // Get information about current theme state
      const htmlHasDarkClass = document.documentElement.classList.contains('dark');
      const localStorageTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      setDebugInfo({
        contextTheme: theme,
        isDarkFromContext: isDark,
        htmlHasDarkClass,
        localStorageTheme,
        systemPrefersDark
      });
      
      console.table({
        "Context Theme": theme,
        "isDark from Context": isDark,
        "HTML has dark class": htmlHasDarkClass,
        "localStorage theme": localStorageTheme,
        "System Prefers Dark": systemPrefersDark
      });
    } catch (e) {
      console.error("Error getting debug info:", e);
      setDebugInfo({ error: e.message });
    }
  };

  // Reset debug info after 5 seconds
  useEffect(() => {
    if (debugInfo) {
      const timeout = setTimeout(() => {
        setDebugInfo(null);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [debugInfo]);
  
  // Handle theme toggle with animation
  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={(e) => {
          e.preventDefault();
          showDebugInfo();
        }}
        className={`relative p-2 rounded-full text-gray-600 dark:text-gray-400 
                   hover:bg-gray-100 dark:hover:bg-gray-800 
                   transition-all duration-300 focus:outline-none 
                   focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                   ${isAnimating ? 'animate-ping-once' : ''}`}
        aria-label="Toggle dark mode"
        title="Left click: Toggle theme, Right click: Show theme debug info"
      >
        <div className={`transform transition-transform duration-300 ${isAnimating ? 'scale-0' : 'scale-100'}`}>
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </div>
      </button>
      
      {/* Radial glow effect behind the button */}
      <div className={`absolute inset-0 rounded-full pointer-events-none
                     ${isDark ? 'bg-yellow-400' : 'bg-blue-400'} opacity-0
                     ${isAnimating ? 'animate-ping-once' : ''}`}>
      </div>
      
      {/* Tooltip */}
      {isHovered && !debugInfo && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap 
                        opacity-0 animate-fade-in">
          {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        </div>
      )}
      
      {/* Debug info popup */}
      {debugInfo && (
        <div className="absolute z-50 bottom-full mb-2 right-0 bg-white dark:bg-dark-500 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-3 text-xs w-64">
          <h4 className="font-bold mb-2 text-sm">Theme Debug Info:</h4>
          {debugInfo.error ? (
            <p className="text-red-500">{debugInfo.error}</p>
          ) : (
            <ul>
              <li className="mb-1"><span className="font-medium">Context Theme:</span> {debugInfo.contextTheme}</li>
              <li className="mb-1"><span className="font-medium">isDark from Context:</span> {debugInfo.isDarkFromContext ? 'true' : 'false'}</li>
              <li className="mb-1"><span className="font-medium">HTML has dark class:</span> {debugInfo.htmlHasDarkClass ? 'true' : 'false'}</li>
              <li className="mb-1"><span className="font-medium">localStorage theme:</span> {debugInfo.localStorageTheme || 'not set'}</li>
              <li><span className="font-medium">System Prefers Dark:</span> {debugInfo.systemPrefersDark ? 'true' : 'false'}</li>
            </ul>
          )}
          <div className="mt-2 text-center">
            <button 
              onClick={() => {
                try {
                  localStorage.removeItem('theme');
                  window.location.reload();
                } catch (e) {
                  console.error('Error resetting theme:', e);
                }
              }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Reset Theme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}