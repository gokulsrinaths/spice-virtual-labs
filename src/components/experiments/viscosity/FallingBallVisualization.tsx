import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BallProperties, FluidProperties, TUBE_HEIGHT } from './types';

interface FallingBallVisualizationProps {
  ball: BallProperties;
  fluid: FluidProperties;
  position: number;
  isRunning: boolean;
  hasReachedTerminal: boolean;
}

export function FallingBallVisualization({
  ball,
  fluid,
  position,
  isRunning,
  hasReachedTerminal
}: FallingBallVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubeWidth = 200; // Made wider for better visibility

  // Convert real-world position (meters) to canvas position (pixels)
  const getCanvasPosition = (pos: number): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    return (pos / TUBE_HEIGHT) * canvas.height;
  };

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

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw tube
    const tubeX = (rect.width - tubeWidth) / 2;
    
    // Create gradient for glass effect
    const glassGradient = ctx.createLinearGradient(tubeX, 0, tubeX + tubeWidth, 0);
    glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    glassGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0)');
    glassGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
    glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
    
    // Draw fluid with subtle gradient
    const fluidGradient = ctx.createLinearGradient(tubeX, 0, tubeX + tubeWidth, 0);
    fluidGradient.addColorStop(0, fluid.color);
    const modifiedColor = fluid.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, 'rgba($1, $2, $3, 0.8)');
    fluidGradient.addColorStop(0.5, modifiedColor);
    fluidGradient.addColorStop(1, fluid.color);
    
    ctx.fillStyle = fluidGradient;
    ctx.fillRect(tubeX, 0, tubeWidth, rect.height);
    
    // Draw glass tube with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 3;
    ctx.strokeRect(tubeX, 0, tubeWidth, rect.height);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw measurement marks with enhanced style
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    const markCount = 15;
    const markSpacing = rect.height / markCount;
    
    for (let i = 0; i <= markCount; i++) {
      const y = i * markSpacing;
      // Left mark
      ctx.beginPath();
      ctx.moveTo(tubeX - 8, y);
      ctx.lineTo(tubeX, y);
      ctx.stroke();
      // Right mark
      ctx.beginPath();
      ctx.moveTo(tubeX + tubeWidth, y);
      ctx.lineTo(tubeX + tubeWidth + 8, y);
      ctx.stroke();
      
      // Add measurement label every 25cm
      if (i % 3 === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'right';
        const height = ((markCount - i) / markCount * TUBE_HEIGHT).toFixed(2);
        ctx.fillText(`${height}m`, tubeX - 16, y + 5);
      }
    }

    // Draw ball with enhanced style
    const ballRadius = (ball.diameter / 0.02) * 25; // Increased size for better visibility
    const ballX = rect.width / 2;
    const ballY = getCanvasPosition(position);
    
    // Ball shadow
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#1f2937';
    ctx.fill();

    // Ball highlight
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#374151';
    ctx.fill();

    // Ball shine
    const shine = ctx.createRadialGradient(
      ballX - ballRadius * 0.3,
      ballY - ballRadius * 0.3,
      ballRadius * 0.1,
      ballX,
      ballY,
      ballRadius
    );
    shine.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = shine;
    ctx.fill();

    // Draw terminal velocity indicator with enhanced style
    if (hasReachedTerminal) {
      const indicatorY = ballY;
      
      // Draw line
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(tubeX - 20, indicatorY);
      ctx.lineTo(tubeX + tubeWidth + 20, indicatorY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw label
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 14px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Terminal Velocity', tubeX + tubeWidth + 30, indicatorY + 5);
    }

    // Draw fluid motion lines when ball is moving
    if (isRunning) {
      const lineCount = 8;
      const lineSpacing = tubeWidth / (lineCount + 1);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      for (let i = 1; i <= lineCount; i++) {
        const x = tubeX + i * lineSpacing;
        const amplitude = 5;
        const frequency = position * 2;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let y = 0; y < rect.height; y += 5) {
          const offset = Math.sin((y + frequency) / 20) * amplitude;
          ctx.lineTo(x + offset, y);
        }
        ctx.stroke();
      }
    }

  }, [ball, fluid, position, isRunning, hasReachedTerminal]);

  return (
    <div className="relative bg-gray-50 rounded-2xl p-8 shadow-lg">
      <canvas
        ref={canvasRef}
        className="w-full bg-white rounded-xl shadow-inner"
        style={{ height: '700px' }}
      />
      {isRunning && (
        <motion.div
          className="absolute top-0 left-1/2 h-full w-0.5 bg-blue-200 opacity-30"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
} 