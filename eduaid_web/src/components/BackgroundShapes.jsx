import React from 'react';
import { motion } from 'framer-motion';

/**
 * BackgroundShapes - A component to add modern floating decorative elements to the background
 * These elements will float and animate independently to create a dynamic background
 */
const BackgroundShapes = () => {
  const shapes = [
    // Circles
    { type: 'circle', size: 30, color: 'rgba(251, 191, 36, 0.1)', top: '15%', left: '10%', delay: 0 },
    { type: 'circle', size: 50, color: 'rgba(59, 130, 246, 0.1)', top: '80%', left: '15%', delay: 1.2 },
    { type: 'circle', size: 70, color: 'rgba(168, 85, 247, 0.1)', top: '40%', left: '80%', delay: 0.5 },
    { type: 'circle', size: 40, color: 'rgba(239, 68, 68, 0.1)', top: '85%', left: '75%', delay: 0.8 },
    { type: 'circle', size: 25, color: 'rgba(251, 191, 36, 0.1)', top: '25%', left: '30%', delay: 1.5 },
    
    // Squares
    { type: 'square', size: 35, color: 'rgba(34, 197, 94, 0.1)', top: '20%', left: '85%', delay: 0.3 },
    { type: 'square', size: 45, color: 'rgba(251, 191, 36, 0.1)', top: '70%', left: '5%', delay: 0.7 },
    { type: 'square', size: 30, color: 'rgba(59, 130, 246, 0.1)', top: '60%', left: '60%', delay: 1.1 },
    
    // Triangles
    { type: 'triangle', size: 40, color: 'rgba(168, 85, 247, 0.1)', top: '10%', left: '60%', delay: 0.4 },
    { type: 'triangle', size: 35, color: 'rgba(239, 68, 68, 0.1)', top: '50%', left: '10%', delay: 0.9 },
    
    // Blobs
    { type: 'blob', size: 80, color: 'rgba(59, 130, 246, 0.05)', top: '75%', left: '80%', delay: 0.2 },
    { type: 'blob', size: 100, color: 'rgba(168, 85, 247, 0.05)', top: '10%', left: '20%', delay: 0.6 },
    { type: 'blob', size: 70, color: 'rgba(34, 197, 94, 0.05)', top: '35%', left: '65%', delay: 1.0 }
  ];

  // Different movement patterns for various shapes
  const floatVariants = {
    circle: (delay) => ({
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        y: [0, -15, 0],
        x: [0, 10, 0],
        transition: {
          opacity: { duration: 0.5, delay },
          y: {
            repeat: Infinity,
            duration: 3 + Math.random() * 2,
            ease: "easeInOut",
            repeatType: "reverse",
            delay
          },
          x: {
            repeat: Infinity,
            duration: 4 + Math.random() * 2,
            ease: "easeInOut",
            repeatType: "reverse",
            delay: delay + 0.5
          }
        }
      }
    }),
    square: (delay) => ({
      initial: { opacity: 0, rotate: 0 },
      animate: {
        opacity: 1,
        y: [0, -20, 0],
        x: [0, -15, 0],
        rotate: [0, 45, 0],
        transition: {
          opacity: { duration: 0.5, delay },
          y: {
            repeat: Infinity,
            duration: 5 + Math.random() * 2,
            ease: "easeInOut",
            repeatType: "reverse",
            delay
          },
          x: {
            repeat: Infinity,
            duration: 6 + Math.random() * 2,
            ease: "easeInOut",
            repeatType: "reverse",
            delay: delay + 0.3
          },
          rotate: {
            repeat: Infinity,
            duration: 7 + Math.random() * 3,
            ease: "easeInOut",
            repeatType: "reverse",
            delay: delay + 0.7
          }
        }
      }
    }),
    triangle: (delay) => ({
      initial: { opacity: 0, rotate: 0 },
      animate: {
        opacity: 1,
        y: [0, 15, 0],
        x: [0, 20, 0],
        rotate: [0, 30, 0],
        transition: {
          opacity: { duration: 0.5, delay },
          y: {
            repeat: Infinity,
            duration: 4 + Math.random() * 2,
            ease: "easeInOut",
            repeatType: "reverse",
            delay
          },
          x: {
            repeat: Infinity,
            duration: 5 + Math.random() * 2,
            ease: "easeInOut",
            repeatType: "reverse",
            delay: delay + 0.6
          },
          rotate: {
            repeat: Infinity,
            duration: 6 + Math.random() * 2,
            ease: "easeInOut",
            repeatType: "reverse",
            delay: delay + 0.2
          }
        }
      }
    }),
    blob: (delay) => ({
      initial: { opacity: 0, scale: 0.9 },
      animate: {
        opacity: 1,
        y: [0, -10, 0],
        x: [0, 10, 0],
        scale: [0.9, 1.1, 0.9],
        transition: {
          opacity: { duration: 0.5, delay },
          y: {
            repeat: Infinity,
            duration: 8 + Math.random() * 4,
            ease: "easeInOut",
            repeatType: "reverse",
            delay
          },
          x: {
            repeat: Infinity,
            duration: 9 + Math.random() * 4,
            ease: "easeInOut",
            repeatType: "reverse",
            delay: delay + 0.4
          },
          scale: {
            repeat: Infinity,
            duration: 10 + Math.random() * 5,
            ease: "easeInOut",
            repeatType: "reverse",
            delay: delay + 0.8
          }
        }
      }
    })
  };

  // Render each shape element
  const renderShape = (shape, index) => {
    const { type, size, color, top, left, delay } = shape;
    const variants = floatVariants[type](delay);
    
    // Common styles
    const commonStyle = {
      position: 'absolute',
      top,
      left,
      width: `${size}px`,
      height: `${size}px`,
      background: color,
      filter: 'blur(8px)',
      zIndex: 1
    };
    
    // Specific styles based on shape type
    switch (type) {
      case 'circle':
        return (
          <motion.div
            key={`shape-${index}`}
            style={{
              ...commonStyle,
              borderRadius: '50%'
            }}
            initial="initial"
            animate="animate"
            variants={variants}
          />
        );
      
      case 'square':
        return (
          <motion.div
            key={`shape-${index}`}
            style={{
              ...commonStyle,
              borderRadius: '10%'
            }}
            initial="initial"
            animate="animate"
            variants={variants}
          />
        );
      
      case 'triangle':
        return (
          <motion.div
            key={`shape-${index}`}
            style={{
              position: 'absolute',
              top,
              left,
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              filter: 'blur(8px)',
              zIndex: 1,
              transformOrigin: 'center center'
            }}
            initial="initial"
            animate="animate"
            variants={variants}
          />
        );
      
      case 'blob':
        // Generate random blob shapes
        const borderRadius = `${20 + Math.random() * 30}% ${20 + Math.random() * 30}% ${20 + Math.random() * 30}% ${20 + Math.random() * 30}% / ${20 + Math.random() * 30}% ${20 + Math.random() * 30}% ${20 + Math.random() * 30}% ${20 + Math.random() * 30}%`;
        
        return (
          <motion.div
            key={`shape-${index}`}
            style={{
              ...commonStyle,
              borderRadius
            }}
            initial="initial"
            animate="animate"
            variants={variants}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, index) => renderShape(shape, index))}
    </div>
  );
};

export default BackgroundShapes; 