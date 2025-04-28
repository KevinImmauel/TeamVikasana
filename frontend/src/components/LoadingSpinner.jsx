"use client";

import React from 'react';

/**
 * LoadingSpinner component that can be used across the application
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @param {string} props.message - Optional loading message to display
 * @param {boolean} props.fullPage - Whether to display spinner centered on full page
 * @returns {JSX.Element} - The LoadingSpinner component
 */
export default function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  fullPage = false 
}) {
  // Size classes for the spinner
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  // The spinner content
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-t-transparent border-primary ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      />
      {message && <p className="mt-4 text-foreground font-medium">{message}</p>}
    </div>
  );

  // If fullPage, center in the viewport
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinnerContent}
      </div>
    );
  }

  // Otherwise, just return the spinner
  return spinnerContent;
}