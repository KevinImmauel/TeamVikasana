"use client";

import React from 'react';


export default function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  fullPage = false 
}) {

  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };
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

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}