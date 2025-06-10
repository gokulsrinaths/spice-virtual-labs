import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { experiments } from '../../data/experiments';

export function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<'experiments' | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => {
    setActiveDropdown(activeDropdown === 'experiments' ? null : 'experiments');
  };

  return (
    <nav ref={navRef} className="hidden md:flex items-center space-x-8">
      <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
        Home
      </Link>
      
      {/* Experiments Dropdown */}
      <div className="relative">
        <button
          className={`flex items-center space-x-1 transition-colors ${
            activeDropdown === 'experiments' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
          }`}
          onClick={handleDropdownClick}
        >
          <span>Experiments</span>
          <ChevronDown className={`h-4 w-4 transform transition-transform ${
            activeDropdown === 'experiments' ? 'rotate-180' : ''
          }`} />
        </button>
        
        {activeDropdown === 'experiments' && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
            {experiments.map((experiment) => (
              <React.Fragment key={experiment.id}>
                {experiment.subTopics ? (
                  <div className="px-4 py-2">
                    <div className="font-medium text-gray-900">{experiment.title}</div>
                    <div className="ml-4 mt-1 space-y-1">
                      {experiment.subTopics.map(subTopic => (
                        <Link
                          key={subTopic.id}
                          to={`/experiments/${subTopic.id}`}
                          className="block py-1 text-sm text-gray-700 hover:text-blue-600"
                        >
                          {subTopic.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/experiments/${experiment.id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {experiment.title}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
        Contact
      </Link>
    </nav>
  );
}