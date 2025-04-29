"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Enhanced page transition variants with more dynamic animations
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(8px)",
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(8px)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// 3D rotation variants for more immersive transitions based on direction
const createDirectionalVariants = (direction) => ({
  initial: {
    opacity: 0,
    x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    rotateX: direction === 'up' || direction === 'down' ? 10 : 0,
    rotateY: direction === 'left' || direction === 'right' ? 10 : 0,
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
      mass: 0.5,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
    rotateX: direction === 'up' || direction === 'down' ? 10 : 0,
    rotateY: direction === 'left' || direction === 'right' ? 10 : 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
      mass: 0.5,
    },
  },
});

// Enhanced staggered container for child elements
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

// Enhanced item animation with 3D perspective
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    rotateX: 5,
    transformPerspective: 1000
  },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

// Glass blur effect for modals and popups
const glassVariants = {
  hidden: { 
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  visible: { 
    opacity: 1,
    backdropFilter: "blur(10px)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Animation for cards with hover effect
const cardHoverVariants = {
  rest: { 
    scale: 1, 
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: { 
    scale: 1.02, 
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [direction, setDirection] = useState('fade');
  const [prevPath, setPrevPath] = useState('');

  // Determine direction based on pathname change
  useEffect(() => {
    // Skip on first render
    if (!prevPath) {
      setPrevPath(pathname);
      return;
    }
    
    // Try to determine navigation direction based on path depth
    const prevDepth = (prevPath.match(/\//g) || []).length;
    const currentDepth = (pathname.match(/\//g) || []).length;
    
    if (currentDepth > prevDepth) {
      setDirection('right');
    } else if (currentDepth < prevDepth) {
      setDirection('left');
    } else if (prevPath.localeCompare(pathname) < 0) {
      setDirection('down');
    } else {
      setDirection('up');
    }
    
    setPrevPath(pathname);
  }, [pathname]);
  
  // Choose the right variant based on direction
  const activeVariants = direction === 'fade' 
    ? pageVariants 
    : createDirectionalVariants(direction);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={activeVariants}
        className="h-full w-full transform-gpu"
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px",
          backfaceVisibility: "hidden"
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="h-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Export animation variants for use in individual components
export { 
  containerVariants, 
  itemVariants, 
  glassVariants, 
  cardHoverVariants,
  createDirectionalVariants,
  pageVariants
};