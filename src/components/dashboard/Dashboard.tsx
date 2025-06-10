import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  BookOpen, 
  Clock, 
  Star, 
  ChevronRight, 
  BarChart,
  Beaker
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExperimentProgress {
  id: string;
  title: string;
  progress: number;
  lastAccessed: string;
  completed: boolean;
}

export function Dashboard() {
  // Mock data - replace with actual data from your backend
  const userProgress = {
    completedExperiments: 3,
    totalExperiments: 10,
    totalTimeSpent: '12h 30m',
    averageScore: 85,
  };

  const experiments: ExperimentProgress[] = [
    {
      id: 'mass-density',
      title: 'Mass Density Analysis',
      progress: 100,
      lastAccessed: '2024-03-15',
      completed: true
    },
    {
      id: 'viscosity',
      title: 'Dynamic Viscosity',
      progress: 75,
      lastAccessed: '2024-03-14',
      completed: false
    },
    {
      id: 'bernoulli',
      title: "Bernoulli's Principle",
      progress: 30,
      lastAccessed: '2024-03-13',
      completed: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Student!</h1>
          <p className="text-gray-600 mt-2">Track your progress and continue your experiments.</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Beaker className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Experiments</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.completedExperiments}/{userProgress.totalExperiments}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.totalTimeSpent}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.averageScore}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Certificates Earned</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.completedExperiments}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Experiment Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Experiments</h2>
          <div className="space-y-4">
            {experiments.map((experiment) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{experiment.title}</h3>
                    <p className="text-sm text-gray-500">Last accessed: {experiment.lastAccessed}</p>
                  </div>
                  <Link
                    to={`/experiments/${experiment.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    {experiment.completed ? 'Review' : 'Continue'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="mt-3">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${experiment.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{experiment.progress}% complete</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments
              .filter(exp => exp.completed)
              .map((experiment) => (
                <motion.div
                  key={experiment.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-lg p-6 text-center hover:border-blue-200 transition-colors"
                >
                  <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">{experiment.title}</h3>
                  <p className="text-sm text-gray-500">Completed on {experiment.lastAccessed}</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Download Certificate
                  </button>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 