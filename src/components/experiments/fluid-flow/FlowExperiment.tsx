import React from 'react';
import { FlowCalculator } from './FlowCalculator';
import { FlowCalculatorDisplay } from './FlowCalculatorDisplay';

export function FlowExperiment() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Menu */}
      <div className="h-16 w-full bg-zinc-900 border-b border-zinc-800 flex items-center px-8">
        <h2 className="text-lg font-light">Fluid Flow Analysis</h2>
      </div>

      <div className="p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-light tracking-tight mb-2">Component Flow Analysis</h1>
            <p className="text-zinc-400 text-sm">Study pressure drops and flow characteristics in various components</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Flow Calculator */}
            <div className="col-span-5">
              <FlowCalculatorDisplay />
            </div>

            {/* Right Column - Results Table */}
            <div className="col-span-7">
              <FlowCalculator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 