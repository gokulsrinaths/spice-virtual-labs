import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Beaker, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-900/90" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
          </div>

          {/* Floating Lab Equipment */}
          <motion.div
            className="absolute top-10 right-10 text-blue-400 opacity-20"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Beaker className="h-32 w-32" />
          </motion.div>

          <motion.div
            className="absolute bottom-10 right-20 text-blue-400 opacity-20"
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Microscope className="h-40 w-40" />
          </motion.div>

          <div className="relative px-8 py-16 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Virtual Lab Journey?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Join thousands of students exploring fluid mechanics through our interactive virtual lab.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/experiments"
                className="group inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-white/20"
              >
                View All Experiments
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="#features"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                View Lab Equipment
              </Link>
            </div>

            {/* Lab Safety Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 inline-flex items-center px-4 py-2 bg-green-500/10 border border-green-400/30 rounded-lg"
            >
              <div className="flex items-center gap-2 text-green-200 text-sm">
                <span className="font-medium">🧪 Virtual Lab Safety:</span>
                <span>All experiments are safe and environmentally friendly</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}