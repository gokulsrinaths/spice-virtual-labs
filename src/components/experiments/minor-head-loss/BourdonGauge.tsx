import React from 'react';
import { motion } from 'framer-motion';

interface BourdonGaugeProps {
  pressure: number;
  maxPressure: number;
  isConnected: boolean;
  useImperial: boolean;
  onClick: () => void;
  position: string;
  isReference?: boolean;
}

export const BourdonGauge: React.FC<BourdonGaugeProps> = ({
  pressure,
  maxPressure,
  isConnected,
  useImperial,
  onClick,
  position,
  isReference
}) => {
  // Convert pressure to angle (0 to 270 degrees)
  const pressureToAngle = (p: number): number => {
    return (p / maxPressure) * 270;
  };

  const displayPressure = useImperial 
    ? `${(pressure * 0.000145038).toFixed(2)} psi`
    : `${pressure.toFixed(0)} Pa`;

  // Colors based on whether it's a reference value or calculated
  const gaugeColor = isConnected
    ? isReference
      ? '#F97316' // Orange for reference values
      : '#22C55E' // Green for calculated values
    : '#1E40AF'; // Blue for disconnected

  const needleColor = isReference ? '#F97316' : '#22C55E';

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className="group"
    >
      {/* Gauge Body */}
      <circle
        cx="0"
        cy="0"
        r="30"
        fill={isConnected ? gaugeColor : 'none'}
        stroke={isConnected ? gaugeColor : '#60A5FA'}
        strokeWidth="2"
        fillOpacity={0.2}
      />

      {isConnected && (
        <>
          {/* Gauge Scale */}
          {Array.from({ length: 9 }).map((_, i) => {
            const angle = i * 30;
            const radians = (angle - 45) * (Math.PI / 180);
            const x1 = Math.cos(radians) * 25;
            const y1 = Math.sin(radians) * 25;
            const x2 = Math.cos(radians) * 28;
            const y2 = Math.sin(radians) * 28;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}

          {/* Gauge Needle */}
          <motion.line
            initial={{ rotate: -45 }}
            animate={{ rotate: pressureToAngle(pressure) - 45 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            x1="0"
            y1="0"
            x2="25"
            y2="0"
            stroke={needleColor}
            strokeWidth="2"
            style={{ transformOrigin: "0 0" }}
          />

          {/* Center Pin */}
          <circle
            cx="0"
            cy="0"
            r="3"
            fill={needleColor}
          />

          {/* Pressure Reading */}
          <text
            textAnchor="middle"
            fill="white"
            fontSize="10"
            y="15"
          >
            {displayPressure}
          </text>
        </>
      )}

      {/* Position Label */}
      <text
        textAnchor="middle"
        fill="white"
        fontSize="12"
        y="-5"
      >
        {position}
      </text>

      {/* Hover Tooltip */}
      <g
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        transform="translate(0, -40)"
      >
        <rect
          x="-60"
          y="-20"
          width="120"
          height="20"
          rx="5"
          fill="#1F2937"
        />
        <text
          textAnchor="middle"
          fill="white"
          fontSize="10"
          y="-5"
        >
          {isConnected 
            ? isReference 
              ? "Reference Value (Given)" 
              : "Student Calculation"
            : "Click to connect gauge"}
        </text>
      </g>
    </g>
  );
}; 