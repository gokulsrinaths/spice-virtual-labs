import { useEffect, useRef } from 'react';
import { SimulationParams } from './types';

interface ViscosityVisualizationProps {
  params: SimulationParams;
  isSimulating: boolean;
}

interface FluidParticle {
  x: number;
  y: number;
  baseSpeed: number;
  color: string;
}

export function ViscosityVisualization({ params, isSimulating }: ViscosityVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<FluidParticle[]>([]);

  // Calculate fluid properties based on parameters
  const getFluidProperties = () => {
    // Normalize viscosity effect (0 to 1)
    const viscosityEffect = Math.max(0.05, Math.min(1, params.shearRate / 1000));
    
    // Temperature affects viscosity (higher temp = lower viscosity)
    const temperatureEffect = params.temperature / 100;
    
    // Combined effect (higher = more fluid movement)
    return {
      flowSpeed: viscosityEffect * (1 + temperatureEffect * 0.5),
      particleSize: 3,
      layerCount: 8
    };
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

    // Initialize particles in layers
    const { layerCount } = getFluidProperties();
    const particlesPerLayer = 15;
    const particles: FluidParticle[] = [];
    
    // Create particles for each layer
    for (let layer = 0; layer < layerCount; layer++) {
      const layerHeight = rect.height / layerCount;
      const y = layerHeight * layer + layerHeight / 2;
      const baseSpeed = (layer / (layerCount - 1)); // Speed increases with height
      
      // Color gradient from bottom to top
      const hue = 210; // Blue hue
      const lightness = 40 + (layer / layerCount) * 30; // Gradient effect
      
      for (let i = 0; i < particlesPerLayer; i++) {
        particles.push({
          x: (rect.width / particlesPerLayer) * i,
          y,
          baseSpeed,
          color: `hsl(${hue}, 70%, ${lightness}%)`
        });
      }
    }
    
    particlesRef.current = particles;

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with a slight trail effect
      ctx.fillStyle = 'rgba(249, 250, 251, 0.15)'; // gray-50 with alpha
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Get current fluid properties
      const { flowSpeed, particleSize } = getFluidProperties();

      // Draw velocity gradient arrows
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.2)'; // gray-500 with alpha
      ctx.lineWidth = 1;
      const arrowCount = 8;
      const arrowSpacing = rect.height / arrowCount;
      
      for (let i = 1; i < arrowCount; i++) {
        const y = i * arrowSpacing;
        const speed = (i / arrowCount) * flowSpeed;
        
        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(40, y);
        ctx.lineTo(35, y - 3);
        ctx.moveTo(40, y);
        ctx.lineTo(35, y + 3);
        ctx.stroke();
        
        // Draw speed label
        ctx.fillStyle = 'rgba(107, 114, 128, 0.5)';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${(speed * 100).toFixed(0)}%`, 45, y + 3);
      }

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Update position based on layer speed
        particle.x += particle.baseSpeed * flowSpeed * 5;

        // Wrap around
        if (particle.x > rect.width) {
          particle.x = 0;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw velocity line
        const lineLength = particle.baseSpeed * flowSpeed * 15;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + lineLength, particle.y);
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw layer separators
      ctx.strokeStyle = 'rgba(229, 231, 235, 0.5)'; // gray-200 with alpha
      ctx.setLineDash([5, 5]);
      const { layerCount } = getFluidProperties();
      for (let i = 1; i < layerCount; i++) {
        const y = (rect.height / layerCount) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Add labels
      ctx.fillStyle = 'rgba(107, 114, 128, 0.8)';
      ctx.font = '12px sans-serif';
      ctx.fillText('Velocity Profile', 20, 20);
      ctx.fillText('Faster Flow', rect.width - 80, 20);
      ctx.fillText('Slower Flow', rect.width - 80, rect.height - 10);

      if (isSimulating) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (isSimulating) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulating, params.shearRate, params.temperature]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-gray-50 rounded-lg"
      style={{ aspectRatio: '16/9' }}
    />
  );
} 