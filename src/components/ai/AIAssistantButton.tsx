import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAIAssistant } from './AIAssistantContext';

export const AIAssistantButton: React.FC = () => {
  const { selectedText, toggleSidePanel } = useAIAssistant();
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  // Update button position when text is selected
  useEffect(() => {
    if (selectedText) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Position the button to the left of the selection with slight offset
        setPosition({
          top: rect.top + window.scrollY - 40,
          left: rect.left + window.scrollX - 60 // Offset to the left of the selection
        });
      }
    }
  }, [selectedText]);

  // Animation variants for the pulsing effect
  const pulseVariants = {
    initial: { scale: 1 },
    pulse: { 
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(139, 92, 246, 0.4)',
        '0 0 0 10px rgba(139, 92, 246, 0.0)',
        '0 0 0 0 rgba(139, 92, 246, 0.0)'
      ],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {selectedText && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-[1000] flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-600 transition-colors font-medium"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onClick={toggleSidePanel}
          aria-label="Explain selected text with Maverick AI assistant"
        >
          <motion.div
            className="flex items-center"
            variants={pulseVariants}
            initial="initial"
            animate="pulse"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            <span className="text-sm">AI Maverick</span>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default AIAssistantButton; 