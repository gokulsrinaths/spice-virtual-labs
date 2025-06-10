import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { BourdonGauge } from './BourdonGauge';
import { CONSTANTS, FittingData, GaugeReading } from './types';

interface PipeSystemProps {
  selectedComponent: FittingData;
  flowRate: number;
  valveOpening: number;
  showAnswers: boolean;
  useImperial: boolean;
  onGaugeClick: (position: string) => void;
  gaugeReadings: GaugeReading[];
}

interface TooltipProps {
  x: number;
  y: number;
  title: string;
  content: React.ReactNode;
  color?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, title, content, color = 'gray' }) => (
  <g transform={`translate(${x},${y})`}>
    <rect
      x="-100"
      y="-40"
      width="200"
      height="80"
      rx="4"
      fill={`${color}`}
      fillOpacity="0.1"
      stroke={`${color}`}
      strokeWidth="1"
    />
    <text textAnchor="middle" fill="white" fontSize="12">
      <tspan x="0" y="-20" fontWeight="bold">{title}</tspan>
      {typeof content === 'string' ? (
        <tspan x="0" y="0">{content}</tspan>
      ) : (
        content
      )}
    </text>
  </g>
);

export const PipeSystem: React.FC<PipeSystemProps> = ({
  selectedComponent,
  flowRate,
  valveOpening,
  showAnswers,
  useImperial,
  onGaugeClick,
  gaugeReadings
}) => {
  const PIPE_AREA = 9.33e-5; // m²
  const velocity = flowRate / PIPE_AREA;
  const [hoveredElement, setHoveredElement] = React.useState<string | null>(null);

  // Gauge positions in the system
  const GAUGE_POSITIONS = [
    { id: 'valve-in', x: 350, y: 100, label: 'P₁' },    // Before valve
    { id: 'valve-out', x: 450, y: 100, label: 'P₂' },   // After valve
    { id: 'bend-out', x: 300, y: 350, label: 'P₃' },    // After bend
    { id: 'reducer-in', x: 350, y: 400, label: 'P₄' },  // Before reducer
    { id: 'reducer-out', x: 550, y: 400, label: 'P₅' }  // After reducer
  ];

  const convertPressure = (pressure: number) => {
    return useImperial ? `${(pressure * 0.000145038).toFixed(2)} psi` : `${pressure.toFixed(0)} Pa`;
  };

  const convertVelocity = (vel: number) => {
    return useImperial ? `${(vel * 3.28084).toFixed(2)} ft/s` : `${vel.toFixed(2)} m/s`;
  };

  return (
    <svg className="w-full h-full" viewBox="0 0 800 600" style={{ background: '#111827' }}>
      {/* Blueprint Grid */}
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1E40AF" strokeWidth="0.5" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#grid)" />

      {/* Flow Meter */}
      <g transform="translate(100,250)">
        <rect x="-40" y="-30" width="80" height="60" fill="none" stroke="#60A5FA" strokeWidth="2" />
        <text textAnchor="middle" fill="white" fontSize="12">
          <tspan x="0" y="-5">Flow</tspan>
          <tspan x="0" y="10">Meter</tspan>
        </text>
        <text x="-40" y="45" fill="#EF4444" fontSize="10">Set Flow Rate to Q1, Q2, Q3</text>
      </g>

      {/* Main Circuit */}
      {/* Top horizontal pipe */}
      <path d="M 600 100 L 100 100 L 100 220" stroke="#60A5FA" strokeWidth="4" fill="none" />
      
      {/* Initial horizontal and bend section */}
      <path d="M 140 250 L 250 250" stroke="#60A5FA" strokeWidth="4" fill="none" />
      
      {/* 90° Smooth Bend */}
      <path
        d="M 250 250 Q 300 250 300 300 L 300 400"
        stroke={selectedComponent.id === 'smooth-bend' ? selectedComponent.color : '#60A5FA'}
        strokeWidth="4"
        fill="none"
      />
      <text x="320" y="350" fill="#EC4899" fontSize="12">90° smooth bend</text>

      {/* Bottom horizontal pipe with reducer */}
      <path d="M 300 400 L 600 400" stroke="#60A5FA" strokeWidth="4" fill="none" />

      {/* Right vertical pipe */}
      <path d="M 600 400 L 600 100" stroke="#60A5FA" strokeWidth="4" fill="none" />

      {/* Globe Valve */}
      <g transform="translate(400,100)">
        {selectedComponent.id === 'globe-valve' && (
          <>
            <rect x="-20" y="-15" width="40" height="30" fill={selectedComponent.color} />
            <path d="M -20 -15 L 20 15 M -20 15 L 20 -15" stroke="white" strokeWidth="2" />
            <text x="30" y="-20" fill={selectedComponent.color} fontSize="12">Globe Valve</text>
          </>
        )}
      </g>

      {/* Reducer */}
      {selectedComponent.id === 'reducer' && (
        <g transform="translate(450,400)">
          <path
            d="M -30 -15 L 30 -7.5 L 30 7.5 L -30 15 Z"
            fill={selectedComponent.color}
            stroke={selectedComponent.color}
            strokeWidth="2"
          />
          <text x="40" y="25" fill={selectedComponent.color} fontSize="12">Reducer</text>
        </g>
      )}

      {/* Bourdon Gauges */}
      {GAUGE_POSITIONS.map((pos) => {
        const reading = gaugeReadings.find(g => g.position === pos.id);
        return (
          <g key={pos.id} transform={`translate(${pos.x},${pos.y})`}>
            <BourdonGauge
              pressure={reading?.pressure || 0}
              maxPressure={200000} // 200 kPa max
              isConnected={reading?.isConnected || false}
              useImperial={useImperial}
              onClick={() => onGaugeClick(pos.id)}
              position={pos.label}
            />
          </g>
        );
      })}

      {/* Flow Direction Arrows */}
      {[
        { x: 200, y: 250, rotate: 0 },      // After flow meter
        { x: 300, y: 350, rotate: 90 },     // In bend
        { x: 450, y: 400, rotate: 0 },      // Bottom pipe
        { x: 600, y: 250, rotate: -90 },    // Right vertical pipe
        { x: 350, y: 100, rotate: 180 },    // Top pipe
      ].map((pos, idx) => (
        <g
          key={`arrow-${idx}`}
          transform={`translate(${pos.x},${pos.y}) rotate(${pos.rotate})`}
        >
          <motion.path
            d="M -10 0 L 10 0 M 5 -5 L 10 0 L 5 5"
            stroke="#60A5FA"
            strokeWidth="2"
            fill="none"
            animate={{
              x: [0, 20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: idx * 0.2
            }}
          />
        </g>
      ))}

      {/* Legend */}
      <g transform="translate(650,450)">
        <text fill="white" fontSize="14" fontWeight="bold">Legend</text>
        {[
          { color: '#F97316', label: 'Globe Valve' },
          { color: '#EC4899', label: '90° Smooth Bend' },
          { color: '#22C55E', label: 'Reducer' },
          { color: '#60A5FA', label: 'Flow Path' }
        ].map((item, i) => (
          <g key={item.label} transform={`translate(0,${30 + i * 25})`}>
            <rect width="20" height="20" fill={item.color} fillOpacity="0.5" />
            <text x="30" y="15" fill="white" fontSize="12">{item.label}</text>
          </g>
        ))}
      </g>

      {/* Help Text */}
      <text x="650" y="350" fill="#9CA3AF" fontSize="12">
        Click on blue circles
        <tspan x="650" y="365">to connect gauges</tspan>
      </text>
    </svg>
  );
}; 