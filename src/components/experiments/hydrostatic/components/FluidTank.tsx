import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Fluid } from '../types';
import { formatDepth } from '../utils';

interface FluidTankProps {
  fluid: Fluid;
  depth: number;
  maxDepth: number;
}

export function FluidTank({ fluid, depth, maxDepth }: FluidTankProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Tank dimensions
      const tankWidth = rect.width * 0.7;
      const tankHeight = rect.height * 0.8;
      const tankX = (rect.width - tankWidth) / 2;
      const tankY = (rect.height - tankHeight) / 2;

      // Draw background grid
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      const gridSize = tankHeight / 10;
      
      for (let y = tankY; y <= tankY + tankHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(tankX - 5, y);
        ctx.lineTo(tankX + tankWidth + 5, y);
        ctx.stroke();
      }

      // Draw tank outline
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tankX, tankY);
      ctx.lineTo(tankX, tankY + tankHeight);
      ctx.lineTo(tankX + tankWidth, tankY + tankHeight);
      ctx.lineTo(tankX + tankWidth, tankY);
      ctx.stroke();

      // Calculate fluid height
      const fluidHeight = (depth / maxDepth) * tankHeight;
      const fluidY = tankY + tankHeight - fluidHeight;

      // Draw fluid with gradient and wave effect
      const time = Date.now() * 0.001;
      
      // Create gradient for fluid
      const fluidGradient = ctx.createLinearGradient(
        tankX,
        fluidY,
        tankX + tankWidth,
        tankY + tankHeight
      );
      const color = fluid.color;
      fluidGradient.addColorStop(0, color + '40'); // 25% opacity
      fluidGradient.addColorStop(1, color + '80'); // 50% opacity

      // Draw fluid with wavy surface
      ctx.fillStyle = fluidGradient;
      ctx.beginPath();
      ctx.moveTo(tankX, tankY + tankHeight);
      ctx.lineTo(tankX, fluidY);

      // Draw wavy surface
      for (let x = 0; x <= tankWidth; x++) {
        const waveY = fluidY + Math.sin(x * 0.03 + time * 1.5) * 2;
        ctx.lineTo(tankX + x, waveY);
      }

      ctx.lineTo(tankX + tankWidth, tankY + tankHeight);
      ctx.closePath();
      ctx.fill();

      // Draw depth marker
      ctx.strokeStyle = '#a1a1aa';
      ctx.fillStyle = '#a1a1aa';
      ctx.lineWidth = 1;
      
      // Draw marker line
      ctx.beginPath();
      ctx.moveTo(tankX + tankWidth + 5, fluidY);
      ctx.lineTo(tankX + tankWidth + 20, fluidY);
      ctx.stroke();

      // Draw depth label
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        formatDepth(depth),
        tankX + tankWidth + 30,
        fluidY + 4
      );

      // Draw pressure sensor
      const sensorY = fluidY + fluidHeight * 0.5;
      const sensorRadius = 4;
      
      ctx.fillStyle = '#f4f4f5';
      ctx.beginPath();
      ctx.arc(tankX + tankWidth/2, sensorY, sensorRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw sensor label
      ctx.fillStyle = '#71717a';
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('P', tankX + tankWidth/2, sensorY + sensorRadius + 12);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [fluid, depth, maxDepth]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-transparent"
      />
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-zinc-400 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {fluid.name}
      </motion.div>
    </div>
  );
} 