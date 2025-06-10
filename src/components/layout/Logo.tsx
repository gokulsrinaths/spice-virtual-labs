import React from 'react';
import { Beaker } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Beaker className="h-8 w-8 text-blue-600" />
      <span className="text-2xl font-bold text-gray-900">Virtual Lab</span>
    </div>
  );
}