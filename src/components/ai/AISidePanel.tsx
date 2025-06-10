import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookOpen, FileText, Link as LinkIcon, ExternalLink, Code, AlertCircle, Info, List, Lightbulb, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAIAssistant } from './AIAssistantContext';

export const AISidePanel: React.FC = () => {
  const { showSidePanel, isLoading, explanation, selectedText, closeSidePanel, searchRelatedConcept } = useAIAssistant();

  return (
    <AnimatePresence>
      {showSidePanel && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
            onClick={closeSidePanel}
          />

          {/* Side panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-[1000] overflow-y-auto"
            role="dialog"
            aria-labelledby="ai-assistant-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-500 z-10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-white" />
                  <h3 id="ai-assistant-title" className="text-lg font-bold text-white">Maverick AI Assistant</h3>
                </div>
                <button
                  onClick={closeSidePanel}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close assistant panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Query Display */}
              <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border-t border-white/20">
                <p className="text-sm text-white/80">You selected:</p>
                <p className="font-medium text-white">"{selectedText}"</p>
              </div>
              
              {/* Powered by badge */}
              <div className="px-4 py-2 bg-black/20 flex items-center justify-end gap-1.5">
                <span className="text-xs text-white/70">Powered by</span>
                <div className="flex items-center">
                  <Cpu className="h-3 w-3 text-white/90" />
                  <span className="ml-1 text-xs font-medium text-white">Llama Maverick 17B</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-600">Analyzing with Maverick AI...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Definition */}
                  {explanation?.definition && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                        <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                        Definition
                      </h4>
                      <p className="text-gray-700">{explanation.definition}</p>
                    </div>
                  )}

                  {/* Formula */}
                  {explanation?.formula && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <h4 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                        <Code className="h-5 w-5 text-purple-600 mr-2" />
                        Formula
                      </h4>
                      <div className="bg-white p-3 rounded border border-gray-200 text-center font-medium text-lg mb-2">
                        {explanation.formula}
                      </div>
                      {explanation.formulaDescription && (
                        <p className="text-sm text-gray-600">{explanation.formulaDescription}</p>
                      )}
                    </div>
                  )}

                  {/* Image */}
                  {explanation?.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={explanation.imageUrl} 
                        alt={selectedText} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-2 bg-gray-50 text-xs text-gray-500 text-center">
                        Visual representation related to {selectedText}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  {explanation?.examples && explanation.examples.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                        <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
                        Examples
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {explanation.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Related Concepts */}
                  {explanation?.relatedConcepts && explanation.relatedConcepts.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                        <List className="h-5 w-5 text-purple-600 mr-2" />
                        Related Concepts
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {explanation.relatedConcepts.map((concept, index) => (
                          <button
                            key={index}
                            className="px-3 py-1 bg-purple-50 hover:bg-purple-100 rounded-full text-sm text-purple-700 transition-colors"
                            onClick={() => searchRelatedConcept(concept)}
                          >
                            {concept}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* References */}
                  {explanation?.references && explanation.references.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                        <FileText className="h-5 w-5 text-purple-600 mr-2" />
                        References
                      </h4>
                      <ul className="space-y-2">
                        {explanation.references.map((reference, index) => (
                          <li key={index}>
                            <Link
                              to={reference.url}
                              className="text-purple-600 hover:text-purple-800 flex items-center"
                            >
                              <LinkIcon className="h-4 w-4 mr-1" />
                              {reference.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Teacher's Note */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-md font-medium text-blue-800 mb-2 flex items-center">
                      <Info className="h-5 w-5 text-blue-600 mr-2" />
                      Teaching Note
                    </h4>
                    <p className="text-sm text-blue-700">
                      This concept is foundational to understanding fluid mechanics principles. 
                      Consider exploring the related experiments for hands-on learning and application.
                    </p>
                  </div>

                  {/* Try Experiment CTA */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-4 text-white">
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Solidify Your Understanding
                    </h4>
                    <p className="text-sm text-white/80 mb-3">
                      The best way to understand this concept is through hands-on experimentation.
                    </p>
                    <Link
                      to={`/experiments/${selectedText.toLowerCase().includes('viscosity') ? 'viscosity' : 
                           selectedText.toLowerCase().includes('density') ? 'mass-density' :
                           selectedText.toLowerCase().includes('bernoulli') ? 'bernoulli' :
                           selectedText.toLowerCase().includes('reynolds') ? 'reynolds' :
                           selectedText.toLowerCase().includes('buoyancy') ? 'buoyancy' : 'fluid-properties'}`}
                      className="block w-full py-2 bg-white text-purple-600 rounded-lg text-center font-medium hover:bg-purple-50 transition-colors"
                    >
                      Try Related Experiment
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AISidePanel; 