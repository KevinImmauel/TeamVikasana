"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import sessionManager from "../lib/utils/sessionManager";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state on component mount and check token validity
  useEffect(() => {
    // Safe localStorage access for server-side rendering
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");

      // Check if token exists and is still valid
      if (storedUser && sessionManager.isTokenValid()) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // Handle invalid JSON in localStorage
          localStorage.removeItem("user");
          sessionManager.clearToken();
        }
      } else if (storedUser && !sessionManager.isTokenValid()) {
        // Token has expired, clear session and redirect to login
        localStorage.removeItem("user");
        sessionManager.clearToken();
        router.push("/auth/login?session_expired=true");
      }

      setLoading(false);
    }
  }, [router]);

  // Set up token expiry monitoring
  useEffect(() => {
    // Skip if not authenticated
    if (!user) return;

    // Function to check token expiry periodically
    const checkTokenExpiry = () => {
      if (!sessionManager.isTokenValid()) {
        // Token expired, log out user
        handleLogout();
        router.push("/auth/login?session_expired=true");
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [user, router]);

  // Login function
  const login = async (credentials) => {
    try {
      // Use a fallback API URL if environment variable is not set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      console.log("Using API URL:", `${apiUrl}/auth/login`);

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response if possible
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Parse response data as JSON
      const data = await response.json();

      // Store user info and token using session manager
      sessionManager.setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Internal logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionManager.clearToken();
    setUser(null);
  };

  // Public logout function
  const logout = () => {
    handleLogout();
    router.push("/auth/login");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && sessionManager.isTokenValid();
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        hasRole,
        hasAnyRole,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);