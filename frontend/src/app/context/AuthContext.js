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
        router.push("/auth/login?session_expired=true");
      }
    };
    
    const interval = setInterval(checkTokenExpiry, 60000);
    
    return () => clearInterval(interval);
  }, [user, router]);


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