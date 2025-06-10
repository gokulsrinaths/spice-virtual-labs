import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
            <Link to="/experiments" className="hover:text-gray-900 dark:hover:text-white">Experiments</Link>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms</a>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Virtual Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}