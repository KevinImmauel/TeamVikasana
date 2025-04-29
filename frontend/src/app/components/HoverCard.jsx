"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HoverCard({ 
  children, 
  content,
  width = 320,
  position = 'top',
  delay = 300,
  followCursor = false,
  glassMorphism = true,
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const timeoutRef = useRef(null);
  
  // Calculate position
  useEffect(() => {
    if (!isVisible || !triggerRef.current || !cardRef.current) return;
    
    const updatePosition = (clientX = null, clientY = null) => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      
      let x, y;
      
      if (followCursor && clientX !== null && clientY !== null) {
        // Position relative to cursor
        x = clientX;
        y = clientY;
        
        // Adjust to ensure card doesn't go off-screen
        if (x + cardRect.width > window.innerWidth) {
          x = window.innerWidth - cardRect.width - 10;
        }
        
        if (y + cardRect.height > window.innerHeight) {
          y = window.innerHeight - cardRect.height - 10;
        }
        
        // Add offset from cursor
        y -= 10;
        x += 10;
      } else {
        // Position relative to trigger element
        const triggerCenter = triggerRect.left + triggerRect.width / 2;
        const idealX = triggerCenter - cardRect.width / 2;
        
        // Don't let card go off-screen horizontally
        x = Math.max(10, Math.min(idealX, window.innerWidth - cardRect.width - 10));
        
        // Vertical position based on 'position' prop
        if (position === 'top') {
          y = triggerRect.top - cardRect.height - 10;
          if (y < 10) y = triggerRect.bottom + 10; // flip to bottom if too close to top
        } else {
          y = triggerRect.bottom + 10;
          if (y + cardRect.height > window.innerHeight - 10) y = triggerRect.top - cardRect.height - 10; // flip to top if too close to bottom
        }
      }
      
      setCoords({ x, y });
    };
    
    updatePosition();
    
    // Set up window resize listener
    window.addEventListener('resize', updatePosition);
    
    // Set up mousemove listener for followCursor mode
    if (followCursor) {
      const handleMouseMove = (e) => {
        updatePosition(e.clientX, e.clientY);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, position, followCursor]);
  
  // Handle mouse events
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };
  
  // Handle card mouse events to prevent flicker
  const handleCardMouseEnter = () => {
    clearTimeout(timeoutRef.current);
  };
  
  const handleCardMouseLeave = () => {
    setIsVisible(false);
  };
  
  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed z-50 ${className}`}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            style={{
              top: `${coords.y}px`,
              left: `${coords.x}px`,
              width: `${width}px`,
            }}
          >
            <div 
              className={`rounded-lg border shadow-lg overflow-hidden ${
                glassMorphism
                  ? 'backdrop-blur-lg bg-white/70 dark:bg-black/50 border-white/20 dark:border-white/10'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-4">{content}</div>
              
              {/* Decorative elements for glassmorphism */}
              {glassMorphism && (
                <>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  <div className="absolute top-[-100px] left-[-100px] w-40 h-40 rounded-full bg-blue-500/20 blur-xl pointer-events-none" />
                  <div className="absolute bottom-[-80px] right-[-80px] w-60 h-60 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}