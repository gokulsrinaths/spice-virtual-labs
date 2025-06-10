import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TUBE_HEIGHT } from '../types';
import { formatHeight } from '../utils';

interface ManometerProps {
  leftHeight: number;
  rightHeight: number;
  oilDensity: number;
  onHeightChange: (left: number, right: number) => void;
}

export function Manometer({
  leftHeight,
  rightHeight,
  oilDensity,
  onHeightChange
}: ManometerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [currentLeft, setCurrentLeft] = useState(leftHeight);
  const [currentRight, setCurrentRight] = useState(rightHeight);

  // Smooth animation of height changes
  useEffect(() => {
    const animateHeights = () => {
      const leftDiff = leftHeight - currentLeft;
      const rightDiff = rightHeight - currentRight;
      const easing = 0.15; // Faster easing for more immediate feedback

      if (Math.abs(leftDiff) > 0.0001 || Math.abs(rightDiff) > 0.0001) {
        setCurrentLeft(prev => prev + leftDiff * easing);
        setCurrentRight(prev => prev + rightDiff * easing);
        animationFrameRef.current = requestAnimationFrame(animateHeights);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateHeights);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [leftHeight, rightHeight, currentLeft, currentRight]);

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

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw U-tube
      const tubeWidth = 50;
      const tubeSpacing = rect.width * 0.35;
      const centerX = rect.width / 2;
      const bottomY = rect.height - 60;
      const tubeHeight = rect.height - 100;

      // Function to convert real height (m) to canvas height (px)
      const heightToCanvas = (height: number) => {
        return (height / TUBE_HEIGHT) * tubeHeight;
      };

      // Draw background grid for better height visualization
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      const gridSize = tubeHeight / 20;
      
      for (let y = bottomY - tubeHeight; y <= bottomY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      // Draw connection to flask (left side)
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, bottomY - tubeHeight * 0.8);
      ctx.lineTo(centerX - tubeSpacing - tubeWidth/2, bottomY - tubeHeight * 0.8);
      ctx.stroke();

      // Draw arrow indicating connection to flask
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(10, bottomY - tubeHeight * 0.8 - 10);
      ctx.lineTo(30, bottomY - tubeHeight * 0.8);
      ctx.lineTo(10, bottomY - tubeHeight * 0.8 + 10);
      ctx.fill();

      // Draw "To Flask" label
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('To Flask', 40, bottomY - tubeHeight * 0.8 + 5);

      // Draw tube outline with enhanced glow effect
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;

      // Draw tubes with double outline for better visibility
      const drawTube = (x: number) => {
        // Inner glow
        ctx.beginPath();
        ctx.moveTo(x - tubeWidth/2, bottomY - tubeHeight);
        ctx.lineTo(x - tubeWidth/2, bottomY);
        ctx.lineTo(x + tubeWidth/2, bottomY);
        ctx.lineTo(x + tubeWidth/2, bottomY - tubeHeight);
        ctx.stroke();

        // Outer glow
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - tubeWidth/2 - 2, bottomY - tubeHeight);
        ctx.lineTo(x - tubeWidth/2 - 2, bottomY);
        ctx.lineTo(x + tubeWidth/2 + 2, bottomY);
        ctx.lineTo(x + tubeWidth/2 + 2, bottomY - tubeHeight);
        ctx.stroke();
      };

      // Left tube
      drawTube(centerX - tubeSpacing);

      // Right tube
      drawTube(centerX + tubeSpacing);

      // Connecting tube with curved corners
      ctx.beginPath();
      ctx.moveTo(centerX - tubeSpacing - tubeWidth/2, bottomY);
      ctx.quadraticCurveTo(
        centerX,
        bottomY + 30,
        centerX + tubeSpacing - tubeWidth/2,
        bottomY
      );
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Draw oil in tubes with enhanced gradient and wave effect
      const leftLevel = bottomY - heightToCanvas(currentLeft);
      const rightLevel = bottomY - heightToCanvas(currentRight);
      const time = Date.now() * 0.001;

      // Create gradient for oil with more vibrant colors
      const oilGradient = ctx.createLinearGradient(
        0,
        bottomY,
        0,
        bottomY - tubeHeight
      );
      oilGradient.addColorStop(0, 'rgba(234, 179, 8, 0.95)');
      oilGradient.addColorStop(1, 'rgba(234, 179, 8, 0.8)');

      // Function to draw wavy oil surface with enhanced effect
      const drawWavySurface = (x: number, width: number, baseY: number) => {
        ctx.beginPath();
        ctx.moveTo(x, bottomY);
        ctx.lineTo(x, baseY);

        // Draw wavy surface with more pronounced waves
        for (let i = 0; i <= width; i++) {
          const waveY = baseY + Math.sin(i * 0.3 + time * 2) * 3;
          ctx.lineTo(x + i, waveY);
        }

        ctx.lineTo(x + width, bottomY);
        ctx.closePath();
      };

      // Left column with highlight
      ctx.fillStyle = oilGradient;
      drawWavySurface(
        centerX - tubeSpacing - tubeWidth/2,
        tubeWidth,
        leftLevel
      );
      ctx.fill();

      // Add shine effect
      const shine = ctx.createLinearGradient(
        centerX - tubeSpacing - tubeWidth/2,
        0,
        centerX - tubeSpacing + tubeWidth/2,
        0
      );
      shine.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shine.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
      shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shine;
      ctx.fill();

      // Right column with same effects
      ctx.fillStyle = oilGradient;
      drawWavySurface(
        centerX + tubeSpacing - tubeWidth/2,
        tubeWidth,
        rightLevel
      );
      ctx.fill();
      ctx.fillStyle = shine;
      ctx.fill();

      // Draw measurement marks with enhanced visibility
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      const markCount = 10;
      const markSpacing = tubeHeight / markCount;

      for (let i = 0; i <= markCount; i++) {
        const y = bottomY - i * markSpacing;
        
        // Left marks
        ctx.beginPath();
        ctx.moveTo(centerX - tubeSpacing - tubeWidth/2 - 8, y);
        ctx.lineTo(centerX - tubeSpacing - tubeWidth/2, y);
        ctx.stroke();

        // Right marks
        ctx.beginPath();
        ctx.moveTo(centerX + tubeSpacing + tubeWidth/2, y);
        ctx.lineTo(centerX + tubeSpacing + tubeWidth/2 + 8, y);
        ctx.stroke();

        // Add measurements with enhanced visibility
        if (i % 2 === 0) {
          const height = (i / markCount * TUBE_HEIGHT * 1000).toFixed(0);
          ctx.fillStyle = '#d1d5db';
          ctx.font = 'bold 12px Inter, system-ui, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(
            `${height}mm`,
            centerX - tubeSpacing - tubeWidth/2 - 15,
            y + 4
          );
          ctx.textAlign = 'left';
          ctx.fillText(
            `${height}mm`,
            centerX + tubeSpacing + tubeWidth/2 + 15,
            y + 4
          );
        }
      }

      // Draw height difference indicator with enhanced visibility
      if (Math.abs(currentRight - currentLeft) > 0.0001) {
        // Draw dashed lines with glow
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // Left horizontal line
        ctx.beginPath();
        ctx.moveTo(centerX - tubeSpacing - tubeWidth/2 - 20, leftLevel);
        ctx.lineTo(centerX - tubeSpacing/2, leftLevel);
        ctx.stroke();

        // Right horizontal line
        ctx.beginPath();
        ctx.moveTo(centerX + tubeSpacing/2, rightLevel);
        ctx.lineTo(centerX + tubeSpacing + tubeWidth/2 + 20, rightLevel);
        ctx.stroke();

        // Vertical line connecting both levels
        ctx.beginPath();
        ctx.moveTo(centerX, leftLevel);
        ctx.lineTo(centerX, rightLevel);
        ctx.stroke();

        ctx.setLineDash([]);

        // Draw Δh label with enhanced visibility
        const heightDiff = formatHeight(currentRight - currentLeft);
        
        // Draw label background
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        const labelWidth = ctx.measureText(`Δh = ${heightDiff}`).width + 20;
        const labelHeight = 30;
        const labelX = centerX - labelWidth/2;
        const labelY = (leftLevel + rightLevel) / 2 - labelHeight/2;
        
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 8);
        ctx.fill();

        // Draw label text
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 16px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Δh = ${heightDiff}`,
          centerX,
          (leftLevel + rightLevel) / 2 + 6
        );

        // Draw arrows with glow
        const arrowSize = 8;
        const drawArrow = (x: number, y: number, pointUp: boolean) => {
          ctx.beginPath();
          if (pointUp) {
            ctx.moveTo(x - arrowSize, y);
            ctx.lineTo(x, y - arrowSize);
            ctx.lineTo(x + arrowSize, y);
          } else {
            ctx.moveTo(x - arrowSize, y);
            ctx.lineTo(x, y + arrowSize);
            ctx.lineTo(x + arrowSize, y);
          }
          ctx.fill();
        };

        drawArrow(centerX, leftLevel, false);
        drawArrow(centerX, rightLevel, true);

        ctx.shadowBlur = 0;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentLeft, currentRight]);

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full bg-transparent rounded-xl"
        style={{ height: '500px' }}
      />
        <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 bg-gray-800/80 px-4 py-2 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
      >
        Oil Density: {oilDensity.toFixed(1)} kg/m³
      </motion.div>
    </div>
  );
}