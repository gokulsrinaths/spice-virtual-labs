import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Play, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: MousePointer2,
    title: 'Choose an Experiment',
    description: 'Select from our wide range of fluid mechanics experiments',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Play,
    title: 'Interactive Learning',
    description: 'Engage with real-time simulations and visualizations',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: CheckCircle,
    title: 'Test Your Knowledge',
    description: 'Complete quizzes and assessments to reinforce learning',
    color: 'from-green-500 to-green-600'
  }
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Get started with our virtual lab in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 h-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} mb-4 shadow-lg`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-blue-200">{step.description}</p>
                
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-4xl font-bold text-white/10">
                  {index + 1}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}