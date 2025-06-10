import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
}

export default function CountUp({
  end,
  duration = 2,
  decimals = 0,
  separator = ',',
  prefix = '',
  suffix = ''
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const currentCount = Math.min(end * easeOutQuad, end);
      
      countRef.current = currentCount;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration, inView]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const [whole, decimal] = fixed.split('.');
    const parts = whole.split('').reverse();
    const formatted = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i > 0 && i % 3 === 0) {
        formatted.unshift(separator);
      }
      formatted.unshift(parts[i]);
    }

    return `${prefix}${formatted.join('')}${decimal ? '.' + decimal : ''}${suffix}`;
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}
    </span>
  );
} 