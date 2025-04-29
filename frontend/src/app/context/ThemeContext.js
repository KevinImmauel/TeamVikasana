"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  // Start with a default theme to avoid UI flash
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  
  // Script to apply theme immediately before React hydrates
  useEffect(() => {
    // This script runs early to avoid flash of wrong theme
    const script = `
      (function() {
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
      })();
    `;

    // Inject the script
    const scriptElement = document.createElement('script');
    scriptElement.textContent = script;
    document.head.appendChild(scriptElement);

    return () => {
      document.head.removeChild(scriptElement);
    };
  }, []);
  
  // Initialize theme state once component mounts
  useEffect(() => {
    setMounted(true);
    
    try {
      // Get theme from localStorage or system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      console.log('Theme init - Saved theme:', savedTheme);
      console.log('Theme init - System prefers dark:', systemPrefersDark);
      
      if (savedTheme) {
        setTheme(savedTheme);
        console.log('Theme init - Using saved theme:', savedTheme);
      } else if (systemPrefersDark) {
        setTheme('dark');
        localStorage.setItem('theme', 'dark');
        console.log('Theme init - Using system preference (dark)');
      } else {
        setTheme('light');
        localStorage.setItem('theme', 'light');
        console.log('Theme init - Using system preference (light)');
      }
    } catch (e) {
      console.error('Theme state initialization error:', e);
      // Fallback to light theme if there's an error
      setTheme('light');
    }
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      console.log('Toggling theme from', theme, 'to', newTheme);
      
      // Add a flash effect to the entire page when theme changes
      const flashElement = document.createElement('div');
      flashElement.className = 'theme-transition-flash';
      document.body.appendChild(flashElement);
      
      // Update state first
      setTheme(newTheme);
      
      // Then persist to localStorage
      localStorage.setItem('theme', newTheme);
      
      // Update DOM - apply directly for immediate effect
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Remove the flash element after animation completes
      setTimeout(() => {
        if (document.body.contains(flashElement)) {
          document.body.removeChild(flashElement);
        }
      }, 500);
      
      console.log('Theme toggled successfully to', newTheme);
    } catch (e) {
      console.error('Theme toggle error:', e);
      alert('Failed to toggle theme. Please check console for details.');
    }
  };

  // Ensure the theme in state and DOM are in sync
  useEffect(() => {
    if (mounted) {
      console.log('Applying theme class based on state:', theme);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      isDark: theme === 'dark' 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);