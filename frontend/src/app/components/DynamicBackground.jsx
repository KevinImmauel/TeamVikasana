"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function DynamicBackground() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Initialize canvas and set dimensions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Track mouse position
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Points grid
    const pointsX = 20;
    const pointsY = 20;
    const points = [];
    
    // Create grid of points
    for (let x = 0; x < pointsX; x++) {
      for (let y = 0; y < pointsY; y++) {
        const xPos = (dimensions.width / (pointsX - 1)) * x;
        const yPos = (dimensions.height / (pointsY - 1)) * y;
        points.push({
          x: xPos,
          y: yPos,
          baseX: xPos,
          baseY: yPos,
          distance: 0,
        });
      }
    }
    
    // Animation
    let animationFrameId;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient
      const gradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        dimensions.width * 0.6
      );
      
      if (isDark) {
        gradient.addColorStop(0, 'rgba(79, 150, 255, 0.03)');
        gradient.addColorStop(0.5, 'rgba(18, 19, 23, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.02)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw points
      points.forEach((point) => {
        // Calculate distance from cursor
        const dx = mousePosition.x - point.baseX;
        const dy = mousePosition.y - point.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate effect radius (how far the effect reaches)
        const effectRadius = dimensions.width * 0.3;
        
        // Calculate displacement based on distance
        const displacement = Math.max(0, 1 - distance / effectRadius);
        const maxDisplacement = 30; // maximum pixel movement
        
        // Apply displacement
        point.x = point.baseX - (dx * displacement * maxDisplacement) / distance || 0;
        point.y = point.baseY - (dy * displacement * maxDisplacement) / distance || 0;
        
        // Draw point
        const size = displacement * 2 + 1;
        const alpha = displacement * 0.3 + 0.1;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = isDark 
          ? `rgba(79, 150, 255, ${alpha})` 
          : `rgba(59, 130, 246, ${alpha})`;
        ctx.fill();
      });
      
      // Connect nearby points with lines
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect nearby points
          const maxConnectionDistance = dimensions.width / 10;
          if (distance < maxConnectionDistance) {
            const opacity = 1 - distance / maxConnectionDistance;
            ctx.strokeStyle = isDark 
              ? `rgba(79, 150, 255, ${opacity * 0.1})` 
              : `rgba(59, 130, 246, ${opacity * 0.05})`;
            
            ctx.lineWidth = 1;
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
          }
        }
      }
      ctx.stroke();
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, mousePosition, isDark]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}