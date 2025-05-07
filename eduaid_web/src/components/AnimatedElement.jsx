import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedElement - A reusable animation component for consistent animations across the app
 * 
 * @param {Object} props - Component props
 * @param {string} props.animationType - Type of animation (fade, slide, float, scale, bounce)
 * @param {string} props.direction - Direction for slide animations (up, down, left, right)
 * @param {number} props.delay - Delay before animation starts (in seconds)
 * @param {number} props.duration - Animation duration (in seconds)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {React.ReactNode} props.children - Component children
 * @param {boolean} props.whileInView - Whether to animate when element enters viewport
 * @param {Object} props.customVariants - Custom animation variants
 * @param {Object} props.hoverEffect - Hover animation effect
 * @param {string} props.as - Render component as different HTML element
 */
const AnimatedElement = ({
  animationType = 'fade',
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
  style = {},
  children,
  whileInView = false,
  customVariants,
  hoverEffect,
  as = 'div',
  ...props
}) => {
  // Common animation variants
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration,
        delay,
        ease: 'easeOut'
      }
    }
  };

  const slideVariants = {
    hidden: { 
      opacity: 0,
      x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration,
        delay,
      }
    }
  };

  const scaleVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.85 
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration,
        delay,
      }
    }
  };

  const floatVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration,
        delay,
      }
    },
    floating: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
        delay,
      }
    }
  };

  const bounceVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        duration,
        delay,
      }
    },
    bounce: {
      y: [0, -10, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
        delay,
      }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration,
        delay,
      }
    },
    glow: {
      boxShadow: [
        '0 0 5px rgba(251, 191, 36, 0.4)',
        '0 0 20px rgba(251, 191, 36, 0.6)',
        '0 0 5px rgba(251, 191, 36, 0.4)'
      ],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
        delay,
      }
    }
  };

  // Available hover effects
  const hoverEffects = {
    grow: { scale: 1.05 },
    lift: { y: -8, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' },
    pulse: { scale: [1, 1.05, 1], transition: { duration: 0.5 } },
    rotate: { rotate: 5 },
    glow: { boxShadow: '0 0 15px rgba(251, 191, 36, 0.6)' },
    bounce: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    ...hoverEffect
  };

  // Select animation variants based on type
  let selectedVariants;
  let animateState;

  switch (animationType) {
    case 'slide':
      selectedVariants = slideVariants;
      animateState = 'visible';
      break;
    case 'scale':
      selectedVariants = scaleVariants;
      animateState = 'visible';
      break;
    case 'float':
      selectedVariants = floatVariants;
      animateState = ['visible', 'floating'];
      break;
    case 'bounce':
      selectedVariants = bounceVariants;
      animateState = ['visible', 'bounce'];
      break;
    case 'glow':
      selectedVariants = glowVariants;
      animateState = ['visible', 'glow'];
      break;
    case 'custom':
      selectedVariants = customVariants;
      animateState = 'visible';
      break;
    case 'fade':
    default:
      selectedVariants = fadeVariants;
      animateState = 'visible';
  }

  const Component = motion[as];

  return (
    <Component
      className={className}
      style={style}
      variants={selectedVariants}
      initial="hidden"
      animate={whileInView ? undefined : animateState}
      whileInView={whileInView ? animateState : undefined}
      viewport={whileInView ? { once: false, amount: 0.2 } : undefined}
      whileHover={hoverEffect ? hoverEffects[hoverEffect] : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

export default AnimatedElement; 