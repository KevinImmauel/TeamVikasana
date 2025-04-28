"use client";

import { createContext, useContext, useState } from 'react';
import Toast from '../../components/Toast';

// Create Toast context
const ToastContext = createContext({
  showToast: () => {},
});

/**
 * Provider component for toast notifications
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Show a toast notification
  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  };

  // Remove a toast notification
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook to use toast context
export const useToast = () => useContext(ToastContext);