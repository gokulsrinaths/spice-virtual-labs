import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, AlertTriangle, BookOpen, ChevronRight, Lock } from 'lucide-react';

interface Variation {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  learningObjectives: string[];
  isLocked: boolean;
  unlockRequirements?: string[];
}

interface ExperimentVariationsProps {
  variations: Variation[];
  onSelectVariation: (variationId: string) => void;
  userProgress: {
    completedExperiments: string[];
    skillLevel: number;
  };
}

export function ExperimentVariations({
  variations,
  onSelectVariation,
  userProgress,
}: ExperimentVariationsProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const difficultyLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const filteredVariations = selectedDifficulty === 'all'
    ? variations
    : variations.filter((v) => v.difficulty === selectedDifficulty);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-500';
      case 'intermediate':
        return 'text-yellow-500';
      case 'advanced':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const isVariationAvailable = (variation: Variation) => {
    if (!variation.isLocked) return true;
    if (!variation.unlockRequirements) return false;

    return variation.unlockRequirements.every((req) =>
      userProgress.completedExperiments.includes(req)
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Experiment Variations
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a variation based on your skill level and learning objectives.
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {difficultyLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => setSelectedDifficulty(level.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDifficulty === level.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>

      {/* Variations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVariations.map((variation) => (
          <motion.div
            key={variation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
          >
            {/* Difficulty Badge */}
            <div className="absolute top-4 right-4">
              <div className={`flex items-center ${getDifficultyColor(variation.difficulty)}`}>
                {[...Array(
                  variation.difficulty === 'beginner'
                    ? 1
                    : variation.difficulty === 'intermediate'
                    ? 2
                    : 3
                )].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {variation.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {variation.description}
            </p>

            {/* Time Estimate */}
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{variation.estimatedTime}</span>
            </div>

            {/* Prerequisites */}
            {variation.prerequisites.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Prerequisites
                </h4>
                <ul className="space-y-1">
                  {variation.prerequisites.map((prereq, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                    >
                      <ChevronRight className="w-4 h-4 mr-1" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learning Objectives */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Learning Objectives
              </h4>
              <ul className="space-y-1">
                {variation.learningObjectives.map((objective, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            {/* Start Button */}
            {isVariationAvailable(variation) ? (
              <button
                onClick={() => onSelectVariation(variation.id)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Experiment
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed flex items-center justify-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Locked
                </button>
                <p className="text-sm text-yellow-600 dark:text-yellow-500 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Complete prerequisites to unlock
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 