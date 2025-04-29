"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import sessionManager from "../lib/utils/sessionManager";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");

      if (storedUser && sessionManager.isTokenValid()) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem("user");
          sessionManager.clearToken();
        }
      } else if (storedUser && !sessionManager.isTokenValid()) {
        localStorage.removeItem("user");
        sessionManager.clearToken();
        router.push("/auth/login?session_expired=true");
      }

      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const checkTokenExpiry = () => {
      if (!sessionManager.isTokenValid()) {
        handleLogout();
        router.push("/auth/login");
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, [user, router]);

  const login = async (credentials) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      console.log("Using API URL:", `${apiUrl}/auth/login`);

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
        } catch (e) {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      sessionManager.setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionManager.clearToken();
    setUser(null);
  };

  const logout = () => {
    handleLogout();
    router.push("/auth/login");
  };

  const isAuthenticated = () => {
    return !!user && sessionManager.isTokenValid();
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

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