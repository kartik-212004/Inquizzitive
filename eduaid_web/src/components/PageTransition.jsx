import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition - A component that wraps pages and provides smooth transitions between routes
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.transitionType - Type of transition animation (fade, slide, scale)
 */
const PageTransition = ({ 
  children, 
  transitionType = 'fade', 
  className = ''
}) => {
  // Define animation variants based on transition type
  const getVariants = () => {
    switch (transitionType) {
      case 'slide':
        return {
          initial: { opacity: 0, x: -300 },
          animate: { 
            opacity: 1, 
            x: 0,
            transition: { 
              type: 'spring',
              stiffness: 80,
              damping: 20,
              mass: 1
            }
          },
          exit: { 
            opacity: 0, 
            x: 300,
            transition: { 
              duration: 0.3,
              ease: 'easeInOut' 
            } 
          }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              type: 'spring',
              stiffness: 70,
              damping: 20,
              mass: 1
            }
          },
          exit: { 
            opacity: 0, 
            scale: 1.2,
            transition: { 
              duration: 0.3,
              ease: 'easeInOut' 
            } 
          }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { 
              duration: 0.4,
              ease: 'easeInOut' 
            }
          },
          exit: { 
            opacity: 0,
            transition: { 
              duration: 0.3,
              ease: 'easeInOut' 
            } 
          }
        };
    }
  };

  return (
    <motion.div
      className={className}
      variants={getVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 