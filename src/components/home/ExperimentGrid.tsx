import React from 'react';
import { ExperimentCard } from './ExperimentCard';
import { experiments } from '../../data/experiments';

export function ExperimentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {experiments.map((experiment) => (
        <ExperimentCard
          key={experiment.id}
          experiment={experiment}
        />
      ))}
    </div>
  );
}