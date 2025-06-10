import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { Experiment } from '../../types/experiments';

interface ExperimentCardProps {
  experiment: Experiment;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const Icon = experiment.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartExperiment = (id: string) => {
    navigate(`/experiments/${id}`);
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
    >
      <div className="p-4 sm:p-6">
        <div 
          className={`flex items-center justify-between mb-4 ${experiment.subTopics ? 'cursor-pointer' : ''}`}
          onClick={() => experiment.subTopics && setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mr-3" />
            <h2 className="text-lg sm:text-xl font-semibold">{experiment.title}</h2>
          </div>
          {experiment.subTopics && (
            <button 
              className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
        
        <p className="text-sm sm:text-base text-gray-600 mb-4">{experiment.description}</p>
        
        {!experiment.subTopics && (
          <button 
            onClick={() => handleStartExperiment(experiment.id)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <span>Start Experiment</span>
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>

      {isExpanded && experiment.subTopics && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white rounded-b-lg shadow-lg border-t mt-0 sm:mt-2">
          <div className="p-4 space-y-3">
            {experiment.subTopics.map((subTopic) => (
              <div key={subTopic.id} className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">{subTopic.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">{subTopic.description}</p>
                <button 
                  onClick={() => handleStartExperiment(subTopic.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <span>Start Experiment</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}