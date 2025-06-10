import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[10001]"
    >
      <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
      }`}>
        {type === 'error' ? (
          <AlertCircle className="h-5 w-5" />
        ) : (
          <CheckCircle className="h-5 w-5" />
        )}
        <span>{message}</span>
      </div>
    </motion.div>
  );
}