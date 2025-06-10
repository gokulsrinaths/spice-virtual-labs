import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { calculateBubbleIntensity } from '../utils';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
}

interface BoilingFlaskProps {
  temperature: number;
  isHeating: boolean;
}

export function BoilingFlask({ temperature, isHeating }: BoilingFlaskProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationFrameRef = useRef<number>();
  const bubbleIntensity = calculateBubbleIntensity(temperature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Flask dimensions
    const flaskWidth = rect.width * 0.6;
    const flaskHeight = rect.height * 0.7;
    const flaskX = (rect.width - flaskWidth) / 2;
    const flaskY = rect.height - flaskHeight - 20;

    // Initialize bubbles
    const createBubble = (): Bubble => ({
      x: flaskX + Math.random() * flaskWidth * 0.6 + flaskWidth * 0.2,
      y: flaskY + flaskHeight - Math.random() * 20,
      radius: Math.random() * 4 + 2,
      speed: (Math.random() + 0.5) * bubbleIntensity * 2
    });

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw flask body (with gradient)
      const gradient = ctx.createLinearGradient(
        flaskX,
        flaskY,
        flaskX + flaskWidth,
        flaskY + flaskHeight
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(flaskX, flaskY);
      ctx.lineTo(flaskX + flaskWidth, flaskY);
      ctx.lineTo(flaskX + flaskWidth * 0.8, flaskY + flaskHeight);
      ctx.lineTo(flaskX + flaskWidth * 0.2, flaskY + flaskHeight);
      ctx.closePath();
      ctx.fill();

      // Flask outline with glow effect
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = isHeating ? 10 : 0;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (isHeating) {
        // Update and draw bubbles
        bubblesRef.current.forEach((bubble, index) => {
          bubble.y -= bubble.speed;
          bubble.x += Math.sin(bubble.y * 0.1) * 0.5;

          // Remove bubbles that reach the top
          if (bubble.y < flaskY) {
            bubblesRef.current[index] = createBubble();
          }

          // Draw bubble
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
          ctx.fill();
        });

        // Add new bubbles based on temperature
        if (Math.random() < bubbleIntensity * 0.3) {
          bubblesRef.current.push(createBubble());
        }

        // Limit total bubbles
        while (bubblesRef.current.length > 20 * bubbleIntensity) {
          bubblesRef.current.shift();
        }

        // Draw vapor effect
        const vaporY = flaskY - 50;
        const vaporIntensity = bubbleIntensity * 0.3;
        const time = Date.now() * 0.001;

        ctx.fillStyle = `rgba(147, 197, 253, ${vaporIntensity})`;
        ctx.beginPath();
        ctx.moveTo(flaskX + flaskWidth * 0.4, flaskY);
        
        // Wavy vapor path
        for (let i = 0; i <= 10; i++) {
          const t = i / 10;
          const x = flaskX + flaskWidth * (0.4 + 0.2 * t);
          const y = flaskY - 50 * t;
          const wave = Math.sin(t * 5 + time * 2) * 10 * t;
          ctx.lineTo(x + wave, y);
        }
        
        ctx.lineTo(flaskX + flaskWidth * 0.7, vaporY);
        ctx.lineTo(flaskX + flaskWidth * 0.3, vaporY);
        ctx.closePath();
        ctx.fill();
      }

      // Draw temperature display with glow
      ctx.shadowColor = isHeating ? '#ef4444' : '#3b82f6';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#e5e7eb';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${temperature.toFixed(1)}°C`, rect.width / 2, rect.height - 10);
      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    bubblesRef.current = Array.from({ length: Math.floor(10 * bubbleIntensity) }, createBubble);
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [temperature, isHeating, bubbleIntensity]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full bg-transparent rounded-xl"
        style={{ height: '400px' }}
      />
      {isHeating && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-t from-red-500/30 via-orange-500/20 to-transparent" />
        </motion.div>
      )}
    </div>
  );
} 