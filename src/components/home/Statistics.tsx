import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, Clock, Beaker } from 'lucide-react';

const stats = [
  {
    label: 'Active Students',
    value: '5,000+',
    icon: Users,
    description: 'Learning fluid mechanics',
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'Experiments',
    value: '15+',
    icon: Beaker,
    description: 'Interactive simulations',
    color: 'from-purple-500 to-purple-600'
  },
  {
    label: 'Success Rate',
    value: '95%',
    icon: Award,
    description: 'Student satisfaction',
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'Learning Hours',
    value: '24/7',
    icon: Clock,
    description: 'Anytime access',
    color: 'from-orange-500 to-orange-600'
  }
];

export function Statistics() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} mb-4`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-lg font-medium text-blue-200 mb-1">{stat.label}</p>
                  <p className="text-sm text-blue-300">{stat.description}</p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}