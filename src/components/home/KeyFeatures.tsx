import React from 'react';
import { motion } from 'framer-motion';
import { TestTubes, Microscope, Beaker, Gauge, LineChart, Laptop } from 'lucide-react';

const features = [
  {
    title: 'Advanced Lab Equipment',
    description: 'Access sophisticated virtual lab equipment and measuring tools.',
    icon: TestTubes
  },
  {
    title: 'Real-Time Analysis',
    description: 'Observe fluid behavior and analyze data in real-time.',
    icon: LineChart
  },
  {
    title: 'Precise Measurements',
    description: 'Take accurate measurements with digital precision tools.',
    icon: Gauge
  },
  {
    title: 'Interactive Experiments',
    description: 'Conduct experiments with full control over variables.',
    icon: Beaker
  },
  {
    title: 'Microscopic View',
    description: 'Zoom into molecular-level fluid dynamics visualization.',
    icon: Microscope
  },
  {
    title: 'Remote Access',
    description: 'Access the lab from anywhere, anytime.',
    icon: Laptop
  }
];

export function KeyFeatures() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lab Equipment & Features</h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Our virtual lab is equipped with state-of-the-art tools and features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-blue-200">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}