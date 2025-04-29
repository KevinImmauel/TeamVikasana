"use client";

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TiltEffect({
  children,
  perspective = 1000,
  scale = 1.05,
  rotationIntensity = 15,
  glareIntensity = 0.3,
  glarePosition = 'all',
  glareColor = '#ffffff',
  shadow = true,
  shadowColor = 'rgba(0, 0, 0, 0.3)',
  gyroscope = false,
  reset = true,
  className = '',
  style = {},
}) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [tiltRotation, setTiltRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle gyroscope-based tilting
  useEffect(() => {
    if (!gyroscope || typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      return;
    }
    
    const handleOrientation = (event) => {
      // Get the device orientation
      const x = event.beta; // -180° to 180° (front/back)
      const y = event.gamma; // -90° to 90° (left/right)
      
      if (x !== null && y !== null) {
        // Normalize values to our expected range
        const normalizedX = Math.min(Math.max(x / 45, -1), 1) * (rotationIntensity / 2);
        const normalizedY = Math.min(Math.max(y / 45, -1), 1) * (rotationIntensity / 2);
        
        setTiltRotation({
          x: -normalizedX,
          y: normalizedY,
        });
      }
    };
    
    window.addEventListener('deviceorientation', handleOrientation);
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyroscope, rotationIntensity]);
  
  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!cardRef.current || gyroscope) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate the position of mouse relative to card center (from -0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Set the position state
    setPosition({ x: relativeX, y: relativeY });
    
    // Calculate the glare position
    const glareX = (e.clientX - rect.left) / rect.width;
    const glareY = (e.clientY - rect.top) / rect.height;
    setGlarePosition({ x: glareX, y: glareY });
    
    // Calculate the tilt rotation
    setTiltRotation({
      x: -relativeY * rotationIntensity,
      y: relativeX * rotationIntensity,
    });
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (reset && !gyroscope) {
      setTiltRotation({ x: 0, y: 0 });
      setPosition({ x: 0, y: 0 });
    }
  };
  
  // Determine glare position based on prop
  const glareStyles = () => {
    if (glarePosition === 'top-right') {
      return {
        background: `linear-gradient(217deg, ${glareColor} 0%, rgba(255, 255, 255, 0) 60%)`,
        opacity: isHovered ? glareIntensity : 0,
      };
    }
    
    if (glarePosition === 'top-left') {
      return {
        background: `linear-gradient(135deg, ${glareColor} 0%, rgba(255, 255, 255, 0) 60%)`,
        opacity: isHovered ? glareIntensity : 0,
      };
    }
    
    if (glarePosition === 'bottom-right') {
      return {
        background: `linear-gradient(315deg, ${glareColor} 0%, rgba(255, 255, 255, 0) 60%)`,
        opacity: isHovered ? glareIntensity : 0,
      };
    }
    
    if (glarePosition === 'bottom-left') {
      return {
        background: `linear-gradient(45deg, ${glareColor} 0%, rgba(255, 255, 255, 0) 60%)`,
        opacity: isHovered ? glareIntensity : 0,
      };
    }
    
    // Dynamic glare that follows cursor position for 'all'
    return {
      background: `radial-gradient(circle at ${glarePosition.x * 100}% ${glarePosition.y * 100}%, ${glareColor} 0%, rgba(255, 255, 255, 0) 70%)`,
      opacity: isHovered ? glareIntensity : 0,
    };
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`transform-gpu ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tiltRotation.x,
        rotateY: tiltRotation.y,
        scale: isHovered ? scale : 1,
        boxShadow: isHovered && shadow 
          ? `0 10px 30px -5px ${shadowColor}` 
          : '0 2px 8px 0px rgba(0, 0, 0, 0.08)',
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1
      }}
    >
      {/* Content container */}
      <div className="w-full h-full relative">
        {children}
        
        {/* Glare effect */}
        {glareIntensity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
            style={glareStyles()}
          />
        )}
      </div>
    </motion.div>
  );
}