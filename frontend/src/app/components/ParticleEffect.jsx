"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ParticleEffect({ 
  trigger = 'hover', // 'hover', 'click', 'load', 'continuous'
  intensity = 'medium', // 'low', 'medium', 'high'
  type = 'sparkle', // 'sparkle', 'confetti', 'trail'
  color = 'theme', // 'theme', 'rainbow', 'success', 'info', 'warning', 'danger'
  className = '',
  children 
}) {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isActive, setIsActive] = useState(trigger === 'load' || trigger === 'continuous');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef(null);
  
  // Configure particle settings based on intensity
  const particleSettings = {
    low: {
      count: 10,
      size: { min: 2, max: 4 },
      speed: { min: 1, max: 3 },
      life: { min: 1000, max: 1500 },
    },
    medium: {
      count: 20,
      size: { min: 3, max: 6 },
      speed: { min: 2, max: 5 },
      life: { min: 1200, max: 2000 },
    },
    high: {
      count: 35,
      size: { min: 3, max: 8 },
      speed: { min: 3, max: 7 },
      life: { min: 1500, max: 2500 },
    },
  };
  
  // Configure particle colors
  const getParticleColors = () => {
    if (color === 'rainbow') {
      return [
        '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', 
        '#0000FF', '#4B0082', '#8B00FF', '#FF00FF'
      ];
    }
    
    if (color === 'success') {
      return isDark 
        ? ['#10B981', '#059669', '#34D399', '#6EE7B7'] 
        : ['#059669', '#10B981', '#34D399', '#6EE7B7'];
    }
    
    if (color === 'info') {
      return isDark 
        ? ['#3B82F6', '#2563EB', '#60A5FA', '#93C5FD'] 
        : ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'];
    }
    
    if (color === 'warning') {
      return isDark 
        ? ['#F59E0B', '#D97706', '#FBBF24', '#FCD34D'] 
        : ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D'];
    }
    
    if (color === 'danger') {
      return isDark 
        ? ['#EF4444', '#DC2626', '#F87171', '#FCA5A5'] 
        : ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'];
    }
    
    // Default 'theme' color
    return isDark 
      ? ['#4F96FF', '#3B82F6', '#60A5FA', '#93C5FD'] 
      : ['#3B82F6', '#2563EB', '#60A5FA', '#93C5FD'];
  };
  
  // Generate a single particle
  const generateParticle = (x, y, options = {}) => {
    const colors = getParticleColors();
    const settings = particleSettings[intensity];
    
    const particle = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      size: options.size || Math.random() * (settings.size.max - settings.size.min) + settings.size.min,
      color: options.color || colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 2 * (settings.speed.max - settings.speed.min) + settings.speed.min,
      speedY: (Math.random() - 0.5) * 2 * (settings.speed.max - settings.speed.min) + settings.speed.min,
      life: options.life || Math.random() * (settings.life.max - settings.life.min) + settings.life.min,
      opacity: 1,
      createdAt: Date.now(),
      // Add specific properties for different types
      ...(type === 'sparkle' ? {
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
      } : {}),
      ...(type === 'trail' ? {
        gravity: 0.02,
      } : {}),
      ...(type === 'confetti' ? {
        width: options.size || Math.random() * (settings.size.max - settings.size.min) + settings.size.min,
        height: (options.size || Math.random() * (settings.size.max - settings.size.min) + settings.size.min) * 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.1,
      } : {}),
    };
    
    return particle;
  };
  
  // Burst of particles
  const createParticleBurst = (x, y) => {
    const settings = particleSettings[intensity];
    const newParticles = [];
    
    for (let i = 0; i < settings.count; i++) {
      newParticles.push(generateParticle(x, y));
    }
    
    setParticles(prevParticles => [...prevParticles, ...newParticles]);
  };
  
  // Continuous particle emission (for trail effect)
  const createParticlesForTrail = () => {
    if (!isActive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = mousePosition.x - rect.left;
    const y = mousePosition.y - rect.top;
    
    // Only create particles if mouse is within the container
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const settings = particleSettings[intensity];
      const newParticles = [];
      
      // Create fewer particles for trails to avoid overwhelming the screen
      const count = Math.max(1, Math.floor(settings.count / 8));
      
      for (let i = 0; i < count; i++) {
        // Slight random offset for trail particles
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        newParticles.push(generateParticle(x + offsetX, y + offsetY, { life: settings.life.min }));
      }
      
      setParticles(prevParticles => [...prevParticles, ...newParticles]);
    }
  };
  
  // Animation loop to update particle positions
  useEffect(() => {
    if (particles.length === 0) return;
    
    const now = Date.now();
    
    const updateParticles = () => {
      setParticles(prevParticles => 
        prevParticles
          .map(particle => {
            const elapsed = now - particle.createdAt;
            const remaining = particle.life - elapsed;
            
            if (remaining <= 0) return null;
            
            const lifeFactor = remaining / particle.life;
            
            // Update particle based on its type
            let updatedParticle = { ...particle };
            
            if (type === 'confetti' || type === 'trail') {
              updatedParticle.speedY += particle.gravity;
            }
            
            updatedParticle.x += particle.speedX;
            updatedParticle.y += particle.speedY;
            updatedParticle.opacity = lifeFactor;
            
            if (type === 'sparkle' || type === 'confetti') {
              updatedParticle.rotation += particle.rotationSpeed;
            }
            
            return updatedParticle;
          })
          .filter(Boolean)
      );
    };
    
    animationRef.current = requestAnimationFrame(updateParticles);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, type]);
  
  // Set up mouse tracking and event listeners
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      
      if (trigger === 'continuous' && type === 'trail') {
        createParticlesForTrail();
      }
    };
    
    const handleMouseEnter = () => {
      if (trigger === 'hover') {
        setIsActive(true);
        const rect = containerRef.current.getBoundingClientRect();
        createParticleBurst(rect.width / 2, rect.height / 2);
      }
    };
    
    const handleMouseLeave = () => {
      if (trigger === 'hover') {
        setIsActive(false);
      }
    };
    
    const handleClick = (e) => {
      if (trigger === 'click') {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createParticleBurst(x, y);
      }
    };
    
    // Create initial particle burst on load
    if (trigger === 'load') {
      const rect = containerRef.current.getBoundingClientRect();
      createParticleBurst(rect.width / 2, rect.height / 2);
      // Disable after initial burst
      setTimeout(() => {
        setIsActive(false);
      }, 1000);
    }
    
    // Set up continuous particles
    let intervalId;
    if (trigger === 'continuous' && type !== 'trail') {
      intervalId = setInterval(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          // Generate particles at random positions within the container
          createParticleBurst(
            Math.random() * rect.width,
            Math.random() * rect.height
          );
        }
      }, 1000);
    }
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    containerRef.current.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        containerRef.current.removeEventListener('click', handleClick);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [trigger, type, intensity]);
  
  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {children}
      
      {/* Render particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(particle => {
          let particleStyle = {
            position: 'absolute',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
            transformOrigin: 'center center',
          };
          
          if (type === 'sparkle') {
            return (
              <div 
                key={particle.id}
                style={{
                  ...particleStyle,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  borderRadius: '50%',
                  transform: `rotate(${particle.rotation}deg)`,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            );
          }
          
          if (type === 'confetti') {
            return (
              <div 
                key={particle.id}
                style={{
                  ...particleStyle,
                  width: `${particle.width}px`,
                  height: `${particle.height}px`,
                  backgroundColor: particle.color,
                  transform: `rotate(${particle.rotation}deg)`,
                }}
              />
            );
          }
          
          // Default trail particle
          return (
            <div 
              key={particle.id}
              style={{
                ...particleStyle,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                borderRadius: '50%',
                filter: `blur(${particle.size/4}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}