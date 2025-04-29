"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function FloatingThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleTheme}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-dark-400 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-dark-500 text-gray-800 dark:text-gray-200 text-xs rounded-md py-1 px-2 shadow-lg whitespace-nowrap border border-gray-200 dark:border-gray-700">
          Switch to {isDark ? 'light' : 'dark'} mode
        </div>
      )}
    </div>
  );
}