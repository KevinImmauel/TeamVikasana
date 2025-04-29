"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor() {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  // Mouse position values with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Add spring physics for smooth cursor movement
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Dot cursor (follows cursor exactly)
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const springDotConfig = { damping: 35, stiffness: 500 };
  const dotSpringX = useSpring(dotX, springDotConfig);
  const dotSpringY = useSpring(dotY, springDotConfig);

  useEffect(() => {
    // Custom cursor only on desktop
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      const handleMouseMove = (e) => {
        // Main cursor
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);

        // Dot cursor follows more precisely
        dotX.set(e.clientX);
        dotY.set(e.clientY);
        
        // Show cursor after first movement
        if (!visible) setVisible(true);
      };

      // Track interactive elements
      const handleMouseOver = (e) => {
        // Check if the target is interactive
        if (
          e.target.tagName === 'BUTTON' ||
          e.target.tagName === 'A' ||
          e.target.tagName === 'INPUT' ||
          e.target.classList.contains('interactive') ||
          e.target.closest('button') ||
          e.target.closest('a') 
        ) {
          setHovering(true);
        }
      };

      const handleMouseOut = () => {
        setHovering(false);
      };

      const handleMouseDown = () => {
        setClicking(true);
      };

      const handleMouseUp = () => {
        setClicking(false);
      };

      // Hide default cursor
      document.body.style.cursor = 'none';

      // Add event listeners
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseover', handleMouseOver, true);
      window.addEventListener('mouseout', handleMouseOut, true);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        // Clean up
        document.body.style.cursor = 'auto';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseover', handleMouseOver, true);
        window.removeEventListener('mouseout', handleMouseOut, true);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [mouseX, mouseY, dotX, dotY, visible]);

  // Don't render on mobile/tablets
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className={`rounded-full bg-transparent border-2 ${isDark ? 'border-white' : 'border-black'}`}
          animate={{
            width: hovering ? 60 : clicking ? 28 : 40,
            height: hovering ? 60 : clicking ? 28 : 40,
            opacity: visible ? 1 : 0,
            scale: hovering ? 1.2 : clicking ? 0.8 : 1,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            mass: 0.5,
          }}
        />
      </motion.div>

      {/* Dot cursor (follows more precisely) */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: dotSpringX,
          y: dotSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className={`rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}
          animate={{
            width: hovering ? 0 : clicking ? 10 : 6,
            height: hovering ? 0 : clicking ? 10 : 6,
            opacity: visible ? 1 : 0,
            scale: clicking ? 1.5 : 1,
          }}
          transition={{
            duration: 0.15,
          }}
        />
      </motion.div>
    </>
  );
}