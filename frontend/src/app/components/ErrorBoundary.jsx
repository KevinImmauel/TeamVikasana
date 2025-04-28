"use client";

import { useEffect } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';
import { useToast } from '../context/ToastContext';

/**
 * Generic fallback component that displays when an error occurs
 */
function ErrorFallback({ error, resetErrorBoundary }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="card p-6 border border-red-200 bg-red-50">
          <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
          <div className="bg-white p-4 rounded mb-4 border border-red-100 overflow-auto max-h-48">
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{error.message}</pre>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={resetErrorBoundary}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              Try again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Return to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Error logging function
 */
function logErrorToService(error, info) {
  // In a real app, you'd send this to your error tracking service
  console.error('Error caught by ErrorBoundary:', error);
  console.error('Component stack:', info?.componentStack || 'No component stack available');
}

/**
 * Main ErrorBoundary component that wraps the application
 */
export default function AppErrorBoundary({ children }) {
  const { showToast } = useToast();
  
  // Optional: Show a toast when error is caught
  const onError = (error, info) => {
    logErrorToService(error, info);
    showToast('An unexpected error occurred', 'error');
  };
  
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={onError}
      onReset={() => {
        // Optional: Reset any state here if needed
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}