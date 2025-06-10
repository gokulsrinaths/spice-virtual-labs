import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string | React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  delay?: number;
  interactive?: boolean;
}

export function Tooltip({
  content,
  position = 'top',
  children,
  className = '',
  showIcon = true,
  delay = 0,
  interactive = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'bottom':
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Wait for next frame to calculate position after tooltip is rendered
      requestAnimationFrame(updatePosition);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!interactive) {
      setIsVisible(false);
    }
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showIcon && (
        <HelpCircle className="ml-1 h-4 w-4 text-gray-400 hover:text-gray-600" />
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={tooltipVariants}
            className={`fixed z-50 max-w-xs bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm
              ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
            style={{
              left: coords.x,
              top: coords.y,
            }}
          >
            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 bg-gray-900 transform rotate-45
                ${position === 'bottom' ? '-top-1' : ''}
                ${position === 'top' ? '-bottom-1' : ''}
                ${position === 'left' ? '-right-1' : ''}
                ${position === 'right' ? '-left-1' : ''}
                ${position === 'top' || position === 'bottom' ? 'left-1/2 -translate-x-1/2' : ''}
                ${position === 'left' || position === 'right' ? 'top-1/2 -translate-y-1/2' : ''}`}
            />
            
            {/* Content */}
            <div className="relative z-10">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 