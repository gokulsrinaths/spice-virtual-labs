import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { experiments } from '../../data/experiments';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-[280px] bg-white shadow-xl md:hidden overflow-y-auto"
          >
            <div className="p-4">
              <nav className="space-y-6">
                <Link
                  to="/"
                  className="block py-2 text-gray-900 font-medium hover:text-blue-600"
                  onClick={onClose}
                >
                  Home
                </Link>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Experiments
                  </h3>
                  <div className="space-y-1">
                    {experiments.map((experiment) => (
                      <div key={experiment.id} className="space-y-1">
                        {experiment.subTopics ? (
                          <>
                            <div className="px-3 py-2 text-gray-900 font-medium">
                              {experiment.title}
                            </div>
                            <div className="pl-6 space-y-1">
                              {experiment.subTopics.map(subTopic => (
                                <Link
                                  key={subTopic.id}
                                  to={`/experiments/${subTopic.id}`}
                                  className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                  onClick={onClose}
                                >
                                  <span className="flex-1">{subTopic.title}</span>
                                  <ChevronRight className="h-5 w-5 text-gray-400" />
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link
                            to={`/experiments/${experiment.id}`}
                            className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={onClose}
                          >
                            <span className="flex-1">{experiment.title}</span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="block py-2 text-gray-900 font-medium hover:text-blue-600"
                  onClick={onClose}
                >
                  Contact
                </Link>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}