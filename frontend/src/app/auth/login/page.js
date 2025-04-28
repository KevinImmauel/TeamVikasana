"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  // Check for session expired query parameter
  useEffect(() => {
    if (searchParams.get('session_expired') === 'true') {
      setSessionExpired(true);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSessionExpired(false);
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }

      // Call login from auth context
      await login(formData);
      
      // Redirect to dashboard on successful login
      router.push("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Beat Management System</h1>
          <p className="text-muted-foreground mt-2">Login to your account</p>
        </div>

        <div className="card">
          {/* Session expired notification */}
          {sessionExpired && (
            <div className="bg-amber-50 border border-amber-300 text-amber-800 p-3 rounded-md mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Your session has expired. Please login again to continue.</span>
              </div>
            </div>
          )}

          {/* Error notification */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input w-full"
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input w-full"
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Contact administrator
          </Link>
        </p>
      </div>
    </div>
  );
}